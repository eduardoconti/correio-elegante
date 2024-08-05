const { container } = require("../../infra/container/container");
const { JWTService } = require("../../infra/jwt");
const { AuthUseCase } = require("../usecase/auth.usecase");

const authModule = () => {
  container.register(
    "authUseCase",
    (usuarioRepository, encripter, jwtService) =>
      new AuthUseCase(usuarioRepository, encripter, jwtService),
    ["usuarioRepository", "encripter", "jwtService"]
  );
  container.register("jwtService", () => new JWTService());
};

module.exports = { authModule };
