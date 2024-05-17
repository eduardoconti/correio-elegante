const Joi = require("joi");

const authSchema = Joi.object({
  login: Joi.string().required(),
  senha: Joi.string().required(),
});

module.exports = { authSchema };
