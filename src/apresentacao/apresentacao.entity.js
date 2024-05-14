/**
 * Representa um objeto de apresentacao.
 * @class
 */
class Apresentacao {
  id;
  idUsuario;
  idUsuarioApresentado;
  interessado;

  /**
   * Cria uma instância de Apresentacao.
   * @param {Object} apresentacao - Objeto contendo informações do usuário.
   * @param {string} apresentacao.idUsuario - O id do usuário que esta avaliando.
   * @param {string} apresentacao.idUsuarioApresentado - O id do usuario apresentado.
   * @param {boolean} apresentacao.interessado - Flag se interessou ou nao
   */

  constructor(apresentacao) {
    this.id = apresentacao.id;
    this.idUsuario = apresentacao.idUsuario;
    this.idUsuarioApresentado = apresentacao.idUsuarioApresentado;
    this.interessado = apresentacao.interessado;
  }
}

module.exports = { Apresentacao };
