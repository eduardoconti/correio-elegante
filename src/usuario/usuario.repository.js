const { connectPostgres } = require("../db/pg-client");
const { Usuario } = require("./usuario.entity");

class UsuarioService {
  async save(usuario) {
    const client = await connectPostgres();

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

  async findById(id) {
    const client = await connectPostgres();

    return await client.query(
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
  }

  async findAll() {
    const client = await connectPostgres();
    const result = await client.query(
      `select id,
              nome,
              email,
              cpf,
              data_nascimento as "dataNascimento",
              imagem,
              genero,
              bio
              from tb_usuario`
    );

    return result.rows.map((usuario) => new Usuario(usuario));
  }

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

module.exports = UsuarioService;
