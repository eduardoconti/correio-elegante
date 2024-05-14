const Joi = require("joi");

const apresentacaoSchema = Joi.object({
  idUsuario: Joi.string().required(),
  idUsuarioApresentado: Joi.string().required(),
  interessado: Joi.boolean().required(),
});

module.exports = { apresentacaoSchema };
