const { Encripter } = require("../infra/encripter");
const { CadastrarUsuarioUseCase } = require("./cadastrar-usuario.usecase");
const { UsuarioRepository } = require("./usuario.repository");
const encripterStub = new Encripter();
const repositoryStub = new UsuarioRepository();
describe("CadastrarUsuarioUseCase", () => {
  let useCase;

  beforeEach(() => {
    useCase = new CadastrarUsuarioUseCase(repositoryStub, encripterStub);
  });

  it("deve estar definido", () => {
    expect(useCase).toBeDefined();
  });

  it("deve executar com sucesso", async () => {
    jest.spyOn(encripterStub, "hash").mockResolvedValue("encripted");
    jest.spyOn(repositoryStub, "save").mockResolvedValue();

    const usuarioMock = {
      bio: "Bio",
      cpf: "10254015905",
      dataNascimento: new Date("1995-12-05"),
      email: "eduardo.conti@gmail.com",
      genero: "M",
      nome: "Eduardo",
      senha: "teste@123",
      interesses: ["F"],
    };
    await useCase.execute(usuarioMock);

    expect(encripterStub.hash).toBeCalledWith(usuarioMock.senha);
    expect(repositoryStub.save).toBeCalledWith({
      ...usuarioMock,
      senha: "encripted",
      dataInclusao: expect.any(Date),
      imagem: "10254015905.jpg",
      id: undefined,
    });
  });
});
