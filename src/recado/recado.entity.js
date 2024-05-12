/**
 * Representa um objeto de recado.
 * @class
 */
class Recado {
  /**
   * Cria uma instância de Recado.
   * @param {Object} recado - Objeto contendo informações do recado.
   * @param {string} recado.remetente - O remetente do recado.
   * @param {string} recado.destinatario - O destinatário do recado.
   * @param {string} recado.conteudo - O conteúdo do recado.
   */
  constructor(recado) {
    this.remetente = recado.remetente;
    this.destinatario = recado.destinatario;
    this.conteudo = recado.conteudo.trim();
  }

  /**
   * Obtém o conteúdo do recado.
   * @returns {string} O conteúdo do recado.
   */
  getConteudo() {
    return this.conteudo;
  }

  /**
   * Obtém o destinatário do recado.
   * @returns {string} O destinatário do recado.
   */
  getDestinatario() {
    return this.destinatario;
  }

  /**
   * Obtém o remetente do recado.
   * @returns {string} O remetente do recado.
   */
  getRemetente() {
    return this.remetente;
  }
}

module.exports = { Recado };
