const { encripter } = require("../../infra/encripter");
const { CadastrarUsuarioRequest } = require("../dto/cadastrar-usuario.dto");
const { Usuario } = require("../entity/usuario.entity");
const { usuarioRepository } = require("../repository/usuario.repository");

class CadastrarUsuarioUseCase {
  /**
   * @param {usuarioRepository} repository
   * @param {encripter} encripter
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

const cadastrarUsuarioUseCase = new CadastrarUsuarioUseCase(
  usuarioRepository,
  encripter
);

module.exports = { cadastrarUsuarioUseCase, CadastrarUsuarioUseCase };
