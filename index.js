const express = require("express");
const UsuarioService = require("./usuario/usuario-service");
const { Usuario } = require("./usuario/usuario");
const { Server } = require("socket.io");
const http = require("http");
const { RecadoRepository } = require("./recado/recado.repository");
const { Recado } = require("./recado/recado");
const app = express();
const port = 3000;
app.use(express.json());

const usuarioRepository = new UsuarioService();
const recadoRepository = new RecadoRepository();
const server = http.createServer(app);
const io = new Server(server);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log("aqui", token);
  if (token) {
    socket.id = token;
    next();
  } else {
    next(new Error("token invalido"));
  }
});

// async function isValidJwt(token) {
//   jwt.verify(token, secrets.jwt, function (err, decoded) {
//     if (err) {
//       console.log(err);
//       return false;
//     } else {
//       //console.log(decoded);
//       return true;
//     }
//   });
// }

io.on("connection", (socket) => {
  console.log("Novo cliente conectado", socket.id);

  // Lidar com desconexão de clientes
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

  socket.on("chat message", async (msg) => {
    const recado = new Recado({
      remetente: socket.id,
      conteudo: msg,
    });
    await recadoRepository.save(recado);
    console.log("message: " + msg);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/usuario", async (req, res) => {
  const usuario = new Usuario(req.body);
  await usuarioRepository.save(usuario);
  res.status(201).send(req.body);
});

app.get("/usuario", async (req, res) => {
  const users = await usuarioRepository.findAll();

  res.status(200).send(
    users.map((u) => {
      return {
        nome: u.getNome(),
        idade: u.getIdade(),
        bio: u.getBio(),
      };
    })
  );
});

app.get("/recado", async (req, res) => {
  const recados = await recadoRepository.find();

  res.status(200).send(recados);
});

server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
