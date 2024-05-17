/**
 * Representa um objeto para avaliar usuario
 * @class
 */
class AvaliarUsuarioApresentadoRequest {
  /**
   * Cria um novo objeto para avaliar usuario
   * @param {Object} input
   * @param {string} input.idUsuario - Id do usuário logado.
   * @param {string} input.idUsuarioApresentado -Id do usuário apresentado.
   * @param {boolean} input.interessado - Flag interessado ou nao.
   */
  constructor(input) {
    this.idUsuario = input.idUsuario;
    this.idUsuarioApresentado = input.idUsuarioApresentado;
    this.interessado = input.interessado;
  }
}

module.exports = { AvaliarUsuarioApresentadoRequest };
