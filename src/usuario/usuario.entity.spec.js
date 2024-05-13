const { Usuario } = require("./usuario.entity");

describe("Usuario", () => {
  let usuario;

  beforeEach(() => {
    usuario = new Usuario({
      bio: "Bio",
      cpf: "10254015905",
      dataNascimento: "1995-12-05",
      email: "eduardo.conti@gmail.com",
      genero: "M",
      nome: "Eduardo",
      senha: "teste@123",
      interesses: ["F"],
    });
  });

  it("deve estar definido", () => {
    expect(usuario).toBeDefined();
  });

  it("teste propriedades", () => {
    expect(usuario).toEqual({
      bio: "Bio",
      cpf: "10254015905",
      dataNascimento: new Date("1995-12-05"),
      email: "eduardo.conti@gmail.com",
      genero: "M",
      nome: "Eduardo",
      senha: "teste@123",
      interesses: ["F"],
      id: undefined,
      imagem: "10254015905.jpg",
      dataInclusao: expect.any(Date),
    });
  });
});
