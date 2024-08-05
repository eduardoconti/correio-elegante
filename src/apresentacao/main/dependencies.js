const { container } = require("../../infra/container/container");
const {
  ApresentacaoRepository,
} = require("../repository/apresentacao.repository");
const {
  AvaliarUsuarioApresentadoUseCase,
} = require("../usecase/avaliar-usuario-apresentado.usecase");

const apresentacaoModule = () => {
  container.register(
    "apresentacaoRepository",
    () => new ApresentacaoRepository()
  );
  container.register(
    "avaliarUsuarioApresentadoUseCase",
    (usuarioRepository, apresentacaoRepository) =>
      new AvaliarUsuarioApresentadoUseCase(
        usuarioRepository,
        apresentacaoRepository
      ),
    ["usuarioRepository", "apresentacaoRepository"]
  );
};

module.exports = { apresentacaoModule };
