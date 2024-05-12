CREATE EXTENSION "uuid-ossp";
CREATE TYPE genero_enum AS ENUM('M', 'F', 'O');
CREATE TABLE tb_usuario (
    id uuid NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    nome VARCHAR(100),
    data_nascimento DATE NOT NULL,
    bio TEXT,
    genero genero_enum NOT NULL,
    email VARCHAR(128) UNIQUE,
    data_inclusao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cpf VARCHAR(14) UNIQUE,
    imagem VARCHAR(128),
    senha VARCHAR(256) NOT NULL,
    CONSTRAINT pk_tb_atendimento PRIMARY KEY (id)
);

CREATE INDEX idx_tb_usuario_genero on tb_usuario(genero);

CREATE TABLE tb_usuario_interesse (
    id SERIAL PRIMARY KEY,
    id_usuario uuid NOT NULL,
    genero genero_enum NOT NULL,
    data_inclusao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tb_usuario_id FOREIGN KEY(id_usuario) REFERENCES tb_usuario(id)
    CONSTRAINT uk_tb_usuario_interesse unique(id_usuario, genero);
);

alter table tb_usuario_interesse add constraint uk_tb_usuario_interesse unique(id_usuario, genero);

CREATE INDEX idx_tb_usuario_interesse_id_usuario on tb_usuario_interesse(id_usuario);



