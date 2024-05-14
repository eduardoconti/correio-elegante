const {
  UnauthorizedException,
} = require("../exceptions/unauthorized.exception");
const { encripter } = require("../infra/encripter");
const { jwtService } = require("../infra/jwt");
const { usuarioRepository } = require("../usuario/usuario.repository");
const { getUrlImagem } = require("../usuario/utils");

class AuthUseCase {
  /**
   * @param {usuarioRepository} usuarioRepository
   * @param {encripter} encripter
   * @param {jwtService} jwtService
   * @returns {string} token
   */
  constructor(usuarioRepository, encripter, jwtService) {
    this.usuarioRepository = usuarioRepository;
    this.encripter = encripter;
    this.jwtService = jwtService;
  }
  async execute(authDto) {
    const user = await this.usuarioRepository.findByCpfForAuth(authDto.login);

    if (!user) {
      throw new UnauthorizedException("Credenciais invalidas");
    }

    if (!(await this.encripter.compare(authDto.senha, user.senha))) {
      throw new UnauthorizedException("Credenciais invalidas");
    }

    const payload = {
      id: user.id,
      name: user.nome,
      image_url: getUrlImagem(user.imagem),
    };

    return this.jwtService.sign(payload);
  }
}

const authUseCase = new AuthUseCase(usuarioRepository, encripter, jwtService);

module.exports = { authUseCase, AuthUseCase };
