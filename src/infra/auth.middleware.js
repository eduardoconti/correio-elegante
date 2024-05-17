const {
  usuarioRepository,
} = require("../usuario/repository/usuario.repository");
const { ErrorResponse } = require("./error-response");
const { jwtService } = require("./jwt");

async function authMiddleware(req, res, next) {
  const headerToken = req.headers["authorization"];

  if (!headerToken) {
    return res
      .status(401)
      .json(ErrorResponse.unauthorized({ message: "Token nao fornecido" }));
  }

  const token = headerToken.split(" ")[1];

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
