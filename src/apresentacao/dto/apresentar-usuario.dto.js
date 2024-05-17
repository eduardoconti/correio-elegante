/**
 * Representa um objeto para avaliar usuario
 * @class
 */
class ApresentarUsuarioRequest {
  /**
   * Cria um novo objeto para avaliar usuario
   * @param {Object} input
   * @param {string} input.idUsuario - Id do usuário logado.
   * @param {number} input.limit - Tamanho da pagina de listagem.
   */
  constructor(input) {
    this.idUsuario = input.idUsuario;
    this.limit = input.limit;
  }
}

module.exports = { ApresentarUsuarioRequest };
