const express = require("express");
const { Server } = require("socket.io");
const fs = require("fs");
const http = require("http");
const { connectMongo } = require("./infra/db/mongo-client");
const path = require("path");

const { Recado } = require("./recado/recado.entity");
const { usuarioSchema } = require("./usuario/dto/cadastrar-usuario.schema");
const { RequestBodyException } = require("./exceptions/request-body.exception");
const bodyParser = require("body-parser");
const multer = require("multer");
const {
  UnauthorizedException,
} = require("./exceptions/unauthorized.exception");
const verificarToken = require("./infra/auth.middleware");
const { envSchema } = require("./infra/env.schema");
const { randomUUID } = require("crypto");
const { validarSchema } = require("./infra/validar-schema");
require("dotenv").config();
validarSchema(process.env, envSchema, {
  stripUnknown: true,
});
const {
  CadastrarUsuarioRequest,
} = require("./usuario/dto/cadastrar-usuario.dto");
const { ErrorResponse } = require("./infra/error-response");
const { StatusCode } = require("./infra/http/enum/status-code");
const { container } = require("./infra/container/container");

const { infraModule } = require("./infra/main/dependencies");
const { userModule } = require("./usuario/main/dependencies");
const { authModule } = require("./auth/main/dependencies");
const { recadoModule } = require("./recado/main/dependencies");
const { apresentacaoModule } = require("./apresentacao/main/dependencies");
const { authController } = require("./auth/controller/auth.controller");
const {
  apresentacaoController,
} = require("./apresentacao/controller/apresentacao.controller");

infraModule();
userModule();
authModule();
recadoModule();
apresentacaoModule();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/user-image", express.static(path.join(__dirname, "../uploads")));
app.use((err, _req, res, _next) => {
  console.log(err);
  if (err instanceof RequestBodyException) {
    return res.status(400).send(ErrorResponse.badRequest(err));
  }

  if (err instanceof UnauthorizedException) {
    return res.status(401).send(ErrorResponse.unauthorized());
  }
  res
    .status(StatusCode.INTERNAL_SERVER_ERROR)
    .send(ErrorResponse.internalError());
});

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

    const usuarioRepository = container.get("usuarioRepository");

    const destinatario = await usuarioRepository.findById(data.destinatario);
    if (!destinatario) {
      console.log("usuario nao encontrado");
    }

    await recadoRepository.save(recado);
    socket.to(recado.destinatario).emit("novo_recado", recado);
  });
});

app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/index.html");
});

authController(app);
apresentacaoController(app);

app.post("/usuario", upload.single("imagem"), async (req, res, next) => {
  const interesses = req.body.interesses?.split(",");
  const input = new CadastrarUsuarioRequest({ ...req.body, interesses });
  const useCase = container.get("cadastrarUsuarioUseCase");
  try {
    validarSchema(input, usuarioSchema);
    await useCase.execute(input);
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
  res.status(StatusCode.NO_CONTENT).send();
});

app.get("/recado", verificarToken, async (_req, res, next) => {
  try {
    const recadoRepository = container.get("recadoRepository");

    const recados = await recadoRepository.find();

    res.status(StatusCode.OK).send(recados);
  } catch (err) {
    return next(err);
  }
});

server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

connectMongo();
