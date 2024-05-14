const { connectPostgres } = require("../infra/db/pg-client");
const { Apresentacao } = require("./apresentacao.entity");

class ApresentacaoRepository {
  /**
   * @param {Apresentacao} apresentacao
   */
  async save(apresentacao) {
    const client = connectPostgres;

    await client.query(`
      INSERT INTO
        tb_apresentacao (
          id_usuario,
          id_usuario_apresentado,
          interessado
        )
      VALUES
        (
          '${apresentacao.idUsuario}',
          '${apresentacao.idUsuarioApresentado}',
          '${apresentacao.interessado}'
        );`);
  }
}
const apresentacaoRepository = new ApresentacaoRepository();

module.exports = { apresentacaoRepository, ApresentacaoRepository };
