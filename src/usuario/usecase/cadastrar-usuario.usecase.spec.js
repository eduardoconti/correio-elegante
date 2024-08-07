const { Encripter } = require("../../infra/encripter");
const { CadastrarUsuarioUseCase } = require("./cadastrar-usuario.usecase");
const { CadastrarUsuarioRequest } = require("../dto/cadastrar-usuario.dto");
const { UsuarioRepository } = require("../repository/usuario.repository");

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

    const input = new CadastrarUsuarioRequest({
      bio: "Bio",
      cpf: "10254015905",
      dataNascimento: new Date("1995-12-05"),
      email: "eduardo.conti@gmail.com",
      genero: "M",
      nome: "Eduardo",
      senha: "teste@123",
      interesses: ["F"],
      imagem: "123.jpg",
    });
    await useCase.execute(input);

    expect(encripterStub.hash).toBeCalledWith(input.senha);
    expect(repositoryStub.save).toBeCalledWith({
      ...input,
      senha: "encripted",
      dataInclusao: expect.any(Date),
      imagem: "123.jpg",
      id: undefined,
    });
  });
});
