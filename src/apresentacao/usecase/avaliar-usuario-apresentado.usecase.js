const {
  usuarioRepository,
} = require("../../usuario/repository/usuario.repository");
const { Apresentacao } = require("../entity/apresentacao.entity");
const {
  apresentacaoRepository,
} = require("../repository/apresentacao.repository");
const {
  AvaliarUsuarioApresentadoRequest,
} = require("../dto/avaliar-usuario-apresentado.dto");

class AvaliarUsuarioApresentadoUseCase {
  /**
   * @param {usuarioRepository} usuarioRepository
   * @param {apresentacaoRepository} apresentacaoRepository
   */
  constructor(usuarioRepository, apresentacaoRepository) {
    this.usuarioRepository = usuarioRepository;
    this.apresentacaoRepository = apresentacaoRepository;
  }
  /**
   *
   * @param {AvaliarUsuarioApresentadoRequest} input
   */
  async executar(input) {
    const apresentacao = new Apresentacao(input);
    if (
      !(await this.usuarioRepository.exists(apresentacao.idUsuarioApresentado))
    ) {
      throw new Error("usuario nao encontrado");
    }

    await this.apresentacaoRepository.save(apresentacao);
  }
}

module.exports = {
  AvaliarUsuarioApresentadoUseCase,
};
