const verificarToken = require("../../infra/auth.middleware");
const { container } = require("../../infra/container/container");
const { StatusCode } = require("../../infra/http/enum/status-code");
const { validarSchema } = require("../../infra/validar-schema");
const { ApresentarUsuarioRequest } = require("../dto/apresentar-usuario.dto");
const { aprensetarUsuarioSchema } = require("../dto/apresentar-usuario.schema");
const {
  AvaliarUsuarioApresentadoRequest,
} = require("../dto/avaliar-usuario-apresentado.dto");
const {
  apresentacaoSchema,
} = require("../dto/avaliar-usuario-apresentado.schema");
const { matchSchema } = require("../dto/match.schema");

const apresentacaoController = (app) => {
  app.get(
    "/apresentacao/apresentar",
    verificarToken,
    async (req, res, next) => {
      try {
        const input = new ApresentarUsuarioRequest({
          ...req.query,
          idUsuario: req.usuario.id,
        });
        validarSchema(input, aprensetarUsuarioSchema);

        const apresentacaoRepository = container.get("apresentacaoRepository");

        const users = await apresentacaoRepository.findUsuariosApresentar(
          input.idUsuario,
          input.limit ?? 1
        );

        if (!users?.length) {
          return res.status(204).send();
        }

        res.status(StatusCode.OK).send(users);
      } catch (err) {
        return next(err);
      }
    }
  );

  app.post("/apresentacao", verificarToken, async (req, res, next) => {
    try {
      const apresentacao = new AvaliarUsuarioApresentadoRequest({
        ...req.body,
        idUsuario: req.usuario.id,
      });
      validarSchema(apresentacao, apresentacaoSchema);
      const avaliarUsuarioApresentadoUseCase = container.get(
        "avaliarUsuarioApresentadoUseCase"
      );
      await avaliarUsuarioApresentadoUseCase.executar(apresentacao);

      res.status(204).send();
    } catch (err) {
      return next(err);
    }
  });

  app.get("/apresentacao/match", verificarToken, async (req, res, next) => {
    try {
      const input = { ...req.query, idUsuario: req.usuario.id };
      validarSchema(input, matchSchema);

      const apresentacaoRepository = container.get("apresentacaoRepository");
      const usuarios = await apresentacaoRepository.listMatch(input);

      res.status(StatusCode.OK).send(usuarios);
    } catch (err) {
      return next(err);
    }
  });
};

module.exports = { apresentacaoController };
