const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const { RecadoRepository } = require("./recado/recado.repository");
const { Recado } = require("./recado/recado.entity");
const { client, connectMongo } = require("./infra/db/mongo-client");
const { usuarioSchema } = require("./usuario/dto/cadastrar-usuario.schema");
const { RequestBodyException } = require("./exceptions/request-body.exception");
const bodyParser = require("body-parser");
const multer = require("multer");
const { validarAuth, authSchema } = require("./auth/auth.schema");
const {
  UnauthorizedException,
} = require("./exceptions/unauthorized.exception");
const path = require("path");
const { jwtService } = require("./infra/jwt");
const verificarToken = require("./infra/auth.middleware");
const {
  usuarioRepository,
} = require("./usuario/repository/usuario.repository");
const {
  cadastrarUsuarioUseCase,
} = require("./usuario/usecase/cadastrar-usuario.usecase");
const { authUseCase } = require("./auth/usecase/auth.usecase");
const { envSchema } = require("./infra/env.schema");
const { randomUUID } = require("crypto");
const fs = require("fs");
const { validarSchema } = require("./infra/validar-schema");
const {
  aprensetarUsuarioSchema,
} = require("./apresentacao/dto/apresentar-usuario.schema");
require("dotenv").config();
validarSchema(process.env, envSchema, {
  stripUnknown: true,
});
require("elastic-apm-node").start();
const {
  avaliarUsuarioUseCase,
} = require("./apresentacao/usecase/avaliar-usuario-apresentado.usecase");
const {
  apresentacaoSchema,
} = require("./apresentacao/dto/avaliar-usuario-apresentado.schema");
const { matchSchema } = require("./apresentacao/dto/match.schema");
const {
  apresentacaoRepository,
} = require("./apresentacao/repository/apresentacao.repository");
const {
  CadastrarUsuarioRequest,
} = require("./usuario/dto/cadastrar-usuario.dto");
const {
  AvaliarUsuarioApresentadoRequest,
} = require("./apresentacao/dto/avaliar-usuario-apresentado.dto");
const {
  ApresentarUsuarioRequest,
} = require("./apresentacao/dto/apresentar-usuario.dto");
const { ErrorResponse } = require("./infra/error-response");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/user-image", express.static(path.join(__dirname, "../uploads")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    try {
      const extName = path.extname(file.originalname);
      const imageName = randomUUID() + extName;
      req.body.imagem = imageName;
      cb(null, imageName);
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

app.post("/auth", async (req, res, next) => {
  try {
    validarSchema(req.body, authSchema);
    const token = await authUseCase.execute(req.body);
    res.status(201).send({ token });
  } catch (err) {
    return next(err);
  }
});

app.post("/usuario", upload.single("imagem"), async (req, res, next) => {
  const interesses = req.body.interesses?.split(",");
  const input = new CadastrarUsuarioRequest({ ...req.body, interesses });
  try {
    validarSchema(input, usuarioSchema);
    await cadastrarUsuarioUseCase.execute(input);
  } catch (err) {
    if (req.file) {
      const imagePath = path.join(__dirname, `../uploads/${input.imagem}`);
      fs.unlink(imagePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Erro ao remover a imagem:", unlinkErr);
        } else {
          console.log("Imagem removida com sucesso");
        }
      });

      return next(err);
    }
  }
  res.status(204).send();
});

app.get("/apresentacao/apresentar", verificarToken, async (req, res, next) => {
  try {
    const input = new ApresentarUsuarioRequest({
      ...req.query,
      idUsuario: req.usuario.id,
    });
    validarSchema(input, aprensetarUsuarioSchema);

    const users = await apresentacaoRepository.findUsuariosApresentar(
      input.idUsuario,
      input.limit ?? 1
    );

    if (!users?.length) {
      return res.status(204).send();
    }

    res.status(200).send(users);
  } catch (err) {
    return next(err);
  }
});

app.post("/apresentacao", verificarToken, async (req, res, next) => {
  try {
    const apresentacao = new AvaliarUsuarioApresentadoRequest({
      ...req.body,
      idUsuario: req.usuario.id,
    });
    validarSchema(apresentacao, apresentacaoSchema);
    await avaliarUsuarioUseCase.executar(apresentacao);

    res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

app.get("/apresentacao/match", verificarToken, async (req, res, next) => {
  try {
    const input = { ...req.query, idUsuario: req.usuario.id };
    validarSchema(input, matchSchema);
    const usuarios = await apresentacaoRepository.listMatch(input);

    res.status(200).send(usuarios);
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

app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof RequestBodyException) {
    return res.status(400).send(ErrorResponse.badRequest(err));
  }

  if (err instanceof UnauthorizedException) {
    return res.status(401).send(ErrorResponse.unauthorized());
  }
  res.status(500).send(ErrorResponse.internalError());
});

server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

connectMongo();
