const Joi = require("joi");

const usuarioSchema = Joi.object({
  nome: Joi.string().required(),
  dataNascimento: Joi.date().required(),
  email: Joi.string().email().required(),
  cpf: Joi.string().max(14).required(),
  genero: Joi.string().max(1).valid("M", "F", "O").required(),
  senha: Joi.string().required(),
  interesses: Joi.array()
    .items(Joi.string().max(1).valid("M", "F", "O").required())
    .required(),
  bio: Joi.string().optional(),
  imagem: Joi.string().required(),
});

module.exports = { usuarioSchema };
