const Joi = require("joi");

const matchSchema = Joi.object({
  idUsuario: Joi.string().required(),
  limit: Joi.number().required(),
  offset: Joi.number().required(),
});

module.exports = { matchSchema };
