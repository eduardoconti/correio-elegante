const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const { RecadoRepository } = require("./recado/recado.repository");
const { Recado } = require("./recado/recado.entity");
const { client, connectMongo } = require("./infra/db/mongo-client");
const { connectPostgres } = require("./infra/db/pg-client");
const { validarUsuario } = require("./usuario/usuario.schema");
const { RequestBodyException } = require("./exceptions/request-body.exception");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const { validarAuth } = require("./auth/auth.schema");
const {
  UnauthorizedException,
} = require("./exceptions/unauthorized.exception");
const { encripter } = require("./infra/encripter");
const { jwtService } = require("./infra/jwt");
const verificarToken = require("./infra/auth.middleware");
const { usuarioRepository } = require("./usuario/usuario.repository");
const {
  cadastrarUsuarioUseCase,
} = require("./usuario/cadastrar-usuario.usecase");
const { authUseCase } = require("./auth/auth.usecase");
const { validarEnv } = require("./infra/env.schema");

require("dotenv").config();
validarEnv(process.env);

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const interesses = req.body.interesses?.split(",");
    try {
      validarUsuario({ ...req.body, interesses });
      cb(null, req.body.cpf + path.extname(file.originalname));
    } catch (error) {
      cb(error);
    }
  },
});

const upload = multer({ storage: storage });

const recadoRepository = new RecadoRepository(client);
const server = http.createServer(app);
const io = new Server(server);

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    next(new UnauthorizedException("Token nao informado"));
  }

  try {
    const tokenDecodificado = jwtService.verify(token);
    const usuario = await usuarioRepository.findById(tokenDecodificado.id);
    if (!usuario) {
      next(new UnauthorizedException("Usuario nao encontrado"));
    }
    socket.id = usuario.id;
    next();
  } catch (err) {
    next(err);
  }
});

io.on("connection", (socket) => {
  console.log("Novo cliente conectado", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

  socket.on("recado", async (data) => {
    const recado = new Recado({
      remetente: socket.id,
      destinatario: data.destinatario,
      conteudo: data.recado,
    });

    const destinatario = await usuarioRepository.findById(data.destinatario);
    if (!destinatario) {
      console.log("usuario nao encontrado");
    }

    await recadoRepository.save(recado);
    socket.to(recado.destinatario).emit("novo_recado", recado);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/usuario", upload.single("imagem"), async (req, res, next) => {
  try {
    await cadastrarUsuarioUseCase.execute(req.body);
  } catch (err) {
    return next(err);
  }
  res.status(204).send();
});

app.get("/usuario", async (req, res, next) => {
  try {
    const users = await usuarioRepository.findAll();
    res.status(200).send(
      users.map((u) => {
        return {
          id: u.id,
          nome: u.nome,
          idade: u.getIdade(),
          bio: u.bio,
          urlImagem: `${u.imagem}`,
        };
      })
    );
  } catch (err) {
    return next(err);
  }
});

app.get("/recado", verificarToken, async (req, res, next) => {
  try {
    const recados = await recadoRepository.find();

    res.status(200).send(recados);
  } catch (err) {
    return next(err);
  }
});

app.post("/auth", async (req, res, next) => {
  try {
    validarAuth(req.body);
    const token = await authUseCase.execute(req.body);
    res.status(201).send({ token });
  } catch (err) {
    return next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof RequestBodyException) {
    return res.status(400).send({ status: 400, detail: err.message });
  }

  if (err instanceof UnauthorizedException) {
    return res.status(401).send({ status: 401, detail: err.message });
  }
  res.status(500).send({ status: 500, detail: "Ocorreu um erro interno!" });
});

server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

connectMongo();
connectPostgres();
