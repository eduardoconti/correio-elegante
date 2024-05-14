const { connectPostgres } = require("../infra/db/pg-client");
const { Usuario } = require("./usuario.entity");

class UsuarioRepository {
  /**
   * @param {Usuario} usuario
   */
  async save(usuario) {
    const client = connectPostgres;

    await client.query(`
    do $$ declare id_usuario UUID;

    BEGIN
    INSERT INTO
      tb_usuario (
        nome,
        data_nascimento,
        bio,
        genero,
        email,
        cpf,
        imagem,
        senha
      )
    VALUES
      (
        '${usuario.nome}',
        '${usuario.getDataNascimento()}',
        '${usuario.bio ?? null}',
        '${usuario.genero}',
        '${usuario.email}',
        '${usuario.cpf}',
        '${usuario.imagem}',
        '${usuario.senha}'
      ) RETURNING id INTO id_usuario;
    
    INSERT INTO
      tb_usuario_interesse (id_usuario, genero)
    VALUES 
      ${this.buildInteresses(usuario.interesses)}
    
    end $$`);
  }

  /**
   *
   * @param {string} id id do usuario
   * @returns {Promise<Usuario | undefined>}
   */
  async findById(id) {
    const client = connectPostgres;

    const model = await client.query(
      `select id,
              nome,
              email,
              cpf,
              data_nascimento as "dataNascimento",
              imagem,
              genero,
              bio
              from tb_usuario where tb_usuario.id = '${id}'`
    );

    if (!model.rows?.length) {
      return;
    }

    const usuario = new Usuario(model.rows[0]);
    return usuario;
  }

  /**
   *
   * @param {string} cpf cpf do usuario
   * @returns {Promise<Usuario | undefined>}
   */
  async findByCpfForAuth(cpf) {
    const client = connectPostgres;

    const model = await client.query(
      `select id,
              nome,
              email,
              cpf,
              genero,
              senha
              from tb_usuario where tb_usuario.cpf = '${cpf}'`
    );

    if (!model.rows?.length) {
      return;
    }

    const usuario = new Usuario(model.rows[0]);
    return usuario;
  }
  /**
   *
   * @param {string} idUsuario
   * @param {number} limit
   * @returns {Promise<Usuario[]>}
   */
  async findUsuariosApresentar(idUsuario, limit) {
    const client = connectPostgres;
    const result = await client.query(
      `SELECT 
      tu.id,
      tu.nome,
      tu.cpf,
      tu.data_nascimento AS "dataNascimento",
      tu.imagem,
      tu.genero,
      tu.bio
  FROM 
      tb_usuario tu
  INNER JOIN 
      tb_usuario_interesse tui ON tu.genero = tui.genero
  LEFT JOIN 
      tb_apresentacao ta ON tu.id = ta.id_usuario_apresentado AND ta.id_usuario = '${idUsuario}'
  WHERE 
      tui.id_usuario = '${idUsuario}'
      AND ta.id_usuario_apresentado IS NULL
  LIMIT ${limit}`
    );

    if (!result.rows.length) {
      return;
    }

    return result.rows.map((usuario) => new Usuario(usuario));
  }

  /**
   *
   * @param {string} id id do usuario
   * @returns {Promise<boolean>}
   */
  async exists(id) {
    const client = connectPostgres;

    const model = await client.query(
      `select id
                from tb_usuario where tb_usuario.id = '${id}'`
    );

    if (!model.rows?.length) {
      return false;
    }
    return true;
  }

  /**
   *
   * @private
   * @param {string[]} interesses
   * @returns
   */
  buildInteresses(interesses) {
    let values = "";

    for (let index = 0; index < interesses.length; index++) {
      const genero = interesses[index];
      values += `(id_usuario,'${genero}')`;

      if (interesses.length === 1 || index === interesses.length - 1) {
        values += ";";
      } else {
        values += ",";
      }
    }
    return ` ${values}`;
  }
}

const usuarioRepository = new UsuarioRepository();

module.exports = { usuarioRepository, UsuarioRepository };
