const { container } = require("../../infra/container/container");
const { UsuarioRepository } = require("../repository/usuario.repository");
const {
  CadastrarUsuarioUseCase,
} = require("../usecase/cadastrar-usuario.usecase");

const userModule = () => {
  container.register("usuarioRepository", () => new UsuarioRepository());
  container.register(
    "cadastrarUsuarioUseCase",
    (repo, encripter) => new CadastrarUsuarioUseCase(repo, encripter),
    ["usuarioRepository", "encripter"]
  );
};

module.exports = { userModule };
