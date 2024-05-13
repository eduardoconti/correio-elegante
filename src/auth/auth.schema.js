const Joi = require("joi");
const {
  RequestBodyException,
} = require("../exceptions/request-body.exception");

const authSchema = Joi.object({
  login: Joi.string().required(),
  senha: Joi.string().required(),
});

const validarAuth = (usuario) => {
  const result = authSchema.validate(usuario);

  if (result.error) {
    let errorMessage = "";

    result.error.details.forEach((e) => {
      errorMessage = e.message;
    });
    throw new RequestBodyException(errorMessage);
  }

  return;
};

module.exports = { validarAuth };
