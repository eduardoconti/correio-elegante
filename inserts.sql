do $ $ declare id_usuario UUID;

BEGIN
INSERT INTO
  tb_usuario (
    nome,
    data_nascimento,
    bio,
    genero,
    email,
    cpf,
    imagem
  )
VALUES
  (
    'Fulano',
    '1990-01-01',
    'Lorem ipsum dolor sit amet',
    'M',
    'fulano@example.com',
    '12345678902',
    'imagem1.jpg'
  ) RETURNING id INTO id_usuario;

INSERT INTO
  tb_usuario_interesse (id_usuario, genero)
VALUES
  (id_usuario, 'M'),
  (id_usuario, 'F');

end $ $