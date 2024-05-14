const { usuarioRepository } = require("../usuario/usuario.repository");
const { Apresentacao } = require("./apresentacao.entity");
const { apresentacaoRepository } = require("./apresentacao.repository");

class AvaliarUsuarioUseCase {
  /**
   * @param {usuarioRepository} usuarioRepository
   * @param {apresentacaoRepository} apresentacaoRepository
   */
  constructor(usuarioRepository, apresentacaoRepository) {
    this.usuarioRepository = usuarioRepository;
    this.apresentacaoRepository = apresentacaoRepository;
  }

  async executar(props) {
    const apresentacao = new Apresentacao(props);
    if (
      !(await this.usuarioRepository.exists(apresentacao.idUsuarioApresentado))
    ) {
      throw new Error("usuario nao encontrado");
    }

    await this.apresentacaoRepository.save(apresentacao);
  }
}

const avaliarUsuarioUseCase = new AvaliarUsuarioUseCase(
  usuarioRepository,
  apresentacaoRepository
);

module.exports = { avaliarUsuarioUseCase, AvaliarUsuarioUseCase };
