const { connectPostgres } = require("../infra/db/pg-client");
const { Usuario } = require("../usuario/usuario.entity");
const { getUrlImagem } = require("../usuario/utils");
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

  async listMatch(props) {
    const client = connectPostgres;
    const result = await client.query(`
    select
        	tu.id,
        	tu.nome,
        	tu.data_nascimento as "dataNascimento",
        	tu.genero,
          tu.imagem,
        	tu.bio	
        from
        	tb_apresentacao ta
        inner join tb_apresentacao ta2 on ta2.id_usuario_apresentado = ta.id_usuario 
        join tb_usuario tu on tu.id = ta.id_usuario 
        where
        	ta.id_usuario_apresentado = '${props.idUsuario}'
        	and ta.interessado = true and ta2.interessado = true
          limit ${props.limit}
          offset ${props.offset}
    `);

    if (!result.rows.length) {
      return;
    }

    return result.rows.map((usuario) => {
      const entity = new Usuario(usuario);
      return {
        id: entity.id,
        name: entity.nome,
        age: entity.getIdade(),
        bio: entity.bio,
        genero: entity.genero,
        image_url: getUrlImagem(entity.imagem),
      };
    });
  }
}
const apresentacaoRepository = new ApresentacaoRepository();

module.exports = { apresentacaoRepository, ApresentacaoRepository };
