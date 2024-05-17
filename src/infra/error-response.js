const {
  RequestBodyException,
} = require("../exceptions/request-body.exception");
const {
  UnauthorizedException,
} = require("../exceptions/unauthorized.exception");

/**
 * @class
 */
class ErrorResponse {
  /**
   * @param {Object} input
   * @param {number} input.status - Http status code.
   * @param {string} input.detail - Detalhe do erro.
   * @param {string} input.title - Titulo do erro.
   */
  constructor(input) {
    this.status = input.status;
    this.detail = input.detail;
    this.title = input.title;
  }
  /**
   *
   * @param {RequestBodyException} err
   * @returns
   */
  static badRequest(err) {
    return new ErrorResponse({ status: 400, detail: err.message });
  }

  /**
   *
   * @param {UnauthorizedException} err
   * @returns
   */
  static unauthorized(err) {
    return new ErrorResponse({ status: 401, detail: err.message });
  }

  /**
   *
   * @returns
   */
  static internalError() {
    return new ErrorResponse({
      status: 500,
      detail: "Ocorreu um erro interno!",
    });
  }
}

module.exports = { ErrorResponse };
