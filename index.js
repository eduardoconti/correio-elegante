const express = require("express");
const UsuarioService = require("./usuario/usuario.repository");
const { Usuario } = require("./usuario/usuario.entity");
const { Server } = require("socket.io");
const http = require("http");
const { RecadoRepository } = require("./recado/recado.repository");
const { Recado } = require("./recado/recado.entity");
const { client, connectMongo } = require("./db/mongo-client");
const { connectPostgres } = require("./db/pg-client");
require("dotenv").config();

const app = express();
const port = 3000;
app.use(express.json());

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

app.post("/usuario", async (req, res, next) => {
  try {
    const usuario = new Usuario(req.body);
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
          id: u.getId(),
          nome: u.getNome(),
          idade: u.getIdade(),
          bio: u.getBio(),
          urlImagem: `${u.getImagem()}`,
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
  res.status(500).send("Ocorreu um erro interno!");
});

server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

connectMongo();
connectPostgres();
