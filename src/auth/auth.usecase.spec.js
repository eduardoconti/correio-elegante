const {
  UnauthorizedException,
} = require("../exceptions/unauthorized.exception");
const { Encripter } = require("../infra/encripter");
const { JWTService } = require("../infra/jwt");
const { Usuario } = require("../usuario/usuario.entity");
const { UsuarioRepository } = require("../usuario/usuario.repository");
const { AuthUseCase } = require("./auth.usecase");

const encripterStub = new Encripter();
const repositoryStub = new UsuarioRepository();
const jwtService = new JWTService();

const usuario = new Usuario({
  bio: "Bio",
  cpf: "10254015905",
  dataNascimento: "1995-12-05",
  email: "eduardo.conti@gmail.com",
  genero: "M",
  nome: "Eduardo",
  senha: "teste@123",
  interesses: ["F"],
});

describe("AuthUseCase", () => {
  let useCase;

  beforeEach(() => {
    useCase = new AuthUseCase(repositoryStub, encripterStub, jwtService);
  });

  it("deve estar definido", () => {
    expect(useCase).toBeDefined();
  });

  it("deve executar com sucesso", async () => {
    jest.spyOn(repositoryStub, "findByCpfForAuth").mockResolvedValue(usuario);
    jest.spyOn(encripterStub, "compare").mockResolvedValue(true);
    jest.spyOn(jwtService, "sign").mockReturnValue("token");
    const authDto = {
      login: "123",
      senha: "456",
    };
    const result = await useCase.execute(authDto);

    expect(result).toBe("token");
    expect(encripterStub.compare).toBeCalledWith(authDto.senha, usuario.senha);
    expect(repositoryStub.findByCpfForAuth).toBeCalledWith(authDto.login);
    expect(jwtService.sign).toBeCalledWith({
      id: usuario.id,
      nome: usuario.nome,
      imagem: usuario.imagem,
    });
  });

  it("deve lancar erro UnauthorizedException quando nao encontra usuario", async () => {
    jest.spyOn(repositoryStub, "findByCpfForAuth").mockResolvedValue(undefined);

    const authDto = {
      login: "123",
      senha: "456",
    };

    await expect(() => useCase.execute(authDto)).rejects.toThrowError(
      new UnauthorizedException("Credenciais invalidas")
    );
  });

  it("deve lancar erro UnauthorizedException quando falha comparacao de senha", async () => {
    jest.spyOn(repositoryStub, "findByCpfForAuth").mockResolvedValue(usuario);
    jest.spyOn(encripterStub, "compare").mockResolvedValue(false);
    const authDto = {
      login: "123",
      senha: "456",
    };

    await expect(() => useCase.execute(authDto)).rejects.toThrowError(
      new UnauthorizedException("Credenciais invalidas")
    );
    expect(encripterStub.compare).toBeCalledWith(authDto.senha, usuario.senha);
  });
});
