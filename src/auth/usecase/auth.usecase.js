const {
  UnauthorizedException,
} = require("../../exceptions/unauthorized.exception");
const { Encripter } = require("../../infra/encripter");
const { JWTService } = require("../../infra/jwt");
const {
  UsuarioRepository,
} = require("../../usuario/repository/usuario.repository");
const { getUrlImagem } = require("../../usuario/utils/utils");

class AuthUseCase {
  /**
   * @param {UsuarioRepository} usuarioRepository
   * @param {Encripter} encripter
   * @param {JWTService} jwtService
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

module.exports = { AuthUseCase };
