const { Encripter } = require("../../infra/encripter");
const { CadastrarUsuarioRequest } = require("../dto/cadastrar-usuario.dto");
const { Usuario } = require("../entity/usuario.entity");
const { UsuarioRepository } = require("../repository/usuario.repository");

class CadastrarUsuarioUseCase {
  /**
   * @param {UsuarioRepository} repository
   * @param {Encripter} encripter
   */
  constructor(repository, encripter) {
    this.usuarioRepository = repository;
    this.encripter = encripter;
  }
  /**
   * @param {CadastrarUsuarioRequest} input
   */
  async execute(input) {
    const usuario = new Usuario(input);
    const senhaEncriptada = await this.encripter.hash(usuario.senha);
    usuario.senha = senhaEncriptada;
    await this.usuarioRepository.save(usuario);
  }
}

module.exports = { CadastrarUsuarioUseCase };
