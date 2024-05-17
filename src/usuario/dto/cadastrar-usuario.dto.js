/**
 * Representa um objeto para cadastro de usuario
 * @class
 */
class CadastrarUsuarioRequest {
  /**
   * Cria um novo objeto de usuário.
   * @param {Object} input - Os dados do usuário.
   * @param {string} input.nome - Nome do usuário.
   * @param {string} input.dataNascimento - Data de nascimento do usuário.
   * @param {string | undefined} input.bio - Biografia do usuário.
   * @param {string} input.genero - Gênero do usuário.
   * @param {string[]} input.interesses - Interesses do usuário.
   * @param {string} input.email - Email do usuário.
   * @param {string} input.cpf - CPF do usuário.
   * @param {string} input.imagem - URL da imagem do usuário.
   * @param {string} input.senha - Senha do usuário.
   */
  constructor(input) {
    this.nome = input.nome;
    this.dataNascimento = input.dataNascimento;
    this.bio = input.bio;
    this.genero = input.genero;
    this.interesses = input.interesses;
    this.email = input.email;
    this.cpf = input.cpf;
    this.imagem = input.imagem;
    this.senha = input.senha;
  }
}

module.exports = { CadastrarUsuarioRequest };
