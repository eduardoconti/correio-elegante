const Joi = require("joi");

const aprensetarUsuarioSchema = Joi.object({
  limit: Joi.number().optional().min(1).max(30),
});

module.exports = { aprensetarUsuarioSchema };
