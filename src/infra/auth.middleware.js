const { container } = require("./container/container");
const { ErrorResponse } = require("./error-response");

async function authMiddleware(req, res, next) {
  const headerToken = req.headers["authorization"];

  if (!headerToken) {
    return res
      .status(401)
      .json(ErrorResponse.unauthorized({ message: "Token nao fornecido" }));
  }

  const token = headerToken.split(" ")[1];
  const jwtService = container.get("jwtService");
  const usuarioRepository = container.get("usuarioRepository");

  try {
    const tokenDecodificado = jwtService.verify(token);

    const usuario = await usuarioRepository.findById(tokenDecodificado.id);

    if (!usuario) {
      return res
        .status(401)
        .json(
          ErrorResponse.unauthorized({ message: "Usuario nao encontrado" })
        );
    }

    req.usuario = usuario;
    next();
  } catch (err) {
    return res
      .status(401)
      .json(ErrorResponse.unauthorized({ message: "Token invalido" }));
  }
}

module.exports = authMiddleware;
