class Recado {
  remetente;
  destinatario;
  conteudo;

  constructor(recado) {
    this.remetente = recado.remetente;
    this.destinatario = recado.destinatario;
    this.conteudo = recado.conteudo;
  }

  getConteudo() {
    return this.conteudo;
  }

  getDestinatario() {
    return this.destinatario;
  }

  getConteudo() {
    return this.conteudo;
  }
}

module.exports = { Recado };
