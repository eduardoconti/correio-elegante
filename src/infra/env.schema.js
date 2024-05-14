const Joi = require("joi");

const envSchema = Joi.object({
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  CONNECTION_STRING: Joi.string().required(),
  PORT: Joi.number().required(),
  API_HOST: Joi.string().required(),
});

module.exports = { envSchema };
