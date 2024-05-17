const { isEmpty } = require("../../utils/utils");

/**
 * Representa um objeto de usuário.
 * @class
 */
class Usuario {
  /**
   * Cria uma instância de Usuario.
   * @param {Object} usuario - Objeto contendo informações do usuário.
   * @param {string} usuario.nome - O nome do usuário.
   * @param {string} usuario.dataNascimento - A data de nascimento do usuário no formato 'YYYY-MM-DD'.
   * @param {string | undefined} usuario.bio - A biografia do usuário.
   * @param {string} usuario.genero - O gênero do usuário ('M', 'F' ou 'O').
   * @param {string[]} usuario.interesses - Os interesses do usuário.
   * @param {string} usuario.email - O email do usuário.
   * @param {Date} [usuario.dataInclusao] - A data de inclusão do usuário (opcional, padrão é a data atual).
   * @param {string} usuario.cpf - O CPF do usuário.
   * @param {string} usuario.senha - A senha do usuário.
   */
  constructor(usuario) {
    this.id = usuario.id;
    this.nome = usuario.nome;
    this.dataNascimento = new Date(usuario.dataNascimento);
    this.bio = isEmpty(usuario.bio) ? undefined : usuario.bio;
    this.genero = usuario.genero;
    this.interesses = usuario.interesses;
    this.email = usuario.email;
    this.dataInclusao = usuario.dataInclusao ?? new Date();
    this.cpf = usuario.cpf;
    this.imagem = usuario.imagem;
    this.senha = usuario.senha;
  }

  /**
   * Calcula a idade do usuário.
   * @returns {number} A idade do usuário.
   */
  getIdade() {
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const mesAtual = dataAtual.getMonth();
    const diaAtual = dataAtual.getDate();

    const anoNascimento = this.dataNascimento.getFullYear();
    const mesNascimento = this.dataNascimento.getMonth();
    const diaNascimento = this.dataNascimento.getDate();

    let idade = anoAtual - anoNascimento;

    const naoFezAniversario =
      mesAtual < mesNascimento ||
      (mesAtual === mesNascimento && diaAtual < diaNascimento);

    if (naoFezAniversario) {
      idade--;
    }

    return idade;
  }

  /**
   * Obtém a data de nascimento do usuário no formato 'YYYY-MM-DD'.
   * @returns {string} A data de nascimento do usuário no formato 'YYYY-MM-DD'.
   */
  getDataNascimento() {
    return this.dataNascimento.toISOString().slice(0, 10);
  }
}

/**
 * Enumeração dos gêneros.
 * @readonly
 * @enum {string}
 */
const generos = {
  Masculino: "M",
  Feminino: "F",
  Outro: "O",
};

module.exports = { Usuario, generos };
