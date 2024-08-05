const { container } = require("../../infra/container/container");
const { StatusCode } = require("../../infra/http/enum/status-code");
const { validarSchema } = require("../../infra/validar-schema");
const { authSchema } = require("../auth.schema");

const authController = (app) => {
  app.post("/auth", async (req, res, next) => {
    try {
      validarSchema(req.body, authSchema);
      const useCase = container.get("authUseCase");
      const token = await useCase.execute(req.body);
      res.status(StatusCode.CREATED).send({ token });
    } catch (err) {
      return next(err);
    }
  });
};

module.exports = { authController };
