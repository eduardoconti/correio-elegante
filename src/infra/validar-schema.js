const Joi = require("joi");

const {
  RequestBodyException,
} = require("../exceptions/request-body.exception");

/**
 *
 * @param {Object} dto
 * @param {Joi.ObjectSchema<any>} shchema
 * @param {Joi.ValidationOptions} options
 * @returns
 */
const validarSchema = (dto, shchema, options) => {
  const result = shchema.validate(dto, options);

  if (result.error) {
    let errorMessage = "";

    result.error.details.forEach((e) => {
      errorMessage = e.message;
    });
    throw new RequestBodyException(errorMessage);
  }

  return;
};
module.exports = { validarSchema };
