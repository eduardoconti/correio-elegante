class UsuarioService {
  static users = [];
  /**
   *
   * @param {Object} usuario
   * @param {number} usuario.id
   * @param {string} usuario.nome
   */
  async save(usuario) {
    Promise.resolve(UsuarioService.users.push(usuario));
  }

  async findById(id) {
    return Promise.resolve(UsuarioService.users.find((e) => e.id === id));
  }

  async findAll() {
    return Promise.resolve(UsuarioService.users);
  }
}

module.exports = UsuarioService;
