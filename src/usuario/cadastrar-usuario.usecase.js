const { encripter } = require("../infra/encripter");
const { Usuario } = require("./usuario.entity");
const { usuarioRepository } = require("./usuario.repository");

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
   * @param {Usuario} usuarioDto
   */
  async execute(usuarioDto) {
    const usuario = new Usuario(usuarioDto);
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
