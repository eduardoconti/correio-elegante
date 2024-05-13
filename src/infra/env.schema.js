const Joi = require("joi");

const envSchema = Joi.object({
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  CONNECTION_STRING: Joi.string().required(),
  PORT: Joi.number().required(),
});

const validarEnv = (usuario) => {
  const result = envSchema.validate(usuario, {
    allowUnknown: false,
    stripUnknown: true,
  });

  if (result.error) {
    let errorMessage = "";

    result.error.details.forEach((e) => {
      errorMessage = e.message;
    });
    throw new Error(errorMessage);
  }

  return;
};

module.exports = { validarEnv };
