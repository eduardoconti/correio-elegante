const express = require("express");
const UsuarioService = require("./usuario/usuario.repository");
const { Usuario } = require("./usuario/usuario.entity");
const { Server } = require("socket.io");
const http = require("http");
const { RecadoRepository } = require("./recado/recado.repository");
const { Recado } = require("./recado/recado.entity");
const { client, connectMongo } = require("./db/mongo-client");
const { connectPostgres } = require("./db/pg-client");
const { validarUsuario } = require("./usuario/usuario.schema");
const { RequestBodyException } = require("./exceptions/request-body.exception");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { Encripter } = require("./infra/encripter");

require("dotenv").config();

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

const usuarioRepository = new UsuarioService();
const recadoRepository = new RecadoRepository(client);
const server = http.createServer(app);
const io = new Server(server);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    next(new Error("token invalido"));
  }
  socket.id = token;
  next();
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
    const usuario = new Usuario(req.body);
    const encripter = new Encripter();
    const senhaEncriptada = await encripter.hash(usuario.senha);
    usuario.senha = senhaEncriptada;
    await usuarioRepository.save(usuario);
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

app.get("/recado", async (req, res, next) => {
  try {
    const recados = await recadoRepository.find();

    res.status(200).send(recados);
  } catch (err) {
    return next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof RequestBodyException) {
    res.status(400).send({ status: 400, detail: err.message });
  } else {
    res.status(500).send({ status: 500, detail: "Ocorreu um erro interno!" });
  }
});

server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

connectMongo();
connectPostgres();
