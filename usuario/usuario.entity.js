const generos = {
  Masculino: "M",
  Feminino: "F",
  Outro: "O",
};

class Usuario {
  id;
  nome;
  dataNascimento;
  bio;
  genero;
  interesses;
  email;
  dataInclusao;
  cpf;
  imagem;
  senha;

  constructor(usuario) {
    this.id = this.id;
    this.nome = usuario.nome;
    this.dataNascimento = new Date(usuario.dataNascimento);
    this.bio = usuario.bio;
    this.genero = usuario.genero;
    this.interesses = usuario.interesses;
    this.email = usuario.email;
    this.dataInclusao = usuario.dataInclusao ?? new Date();
    this.cpf = usuario.cpf;
    this.imagem = `${usuario.cpf}.jpg`;
    this.senha = usuario.senha;
  }

  getId() {
    return this.id;
  }

  getNome() {
    return this.nome;
  }

  getIdade() {
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const mesAtual = dataAtual.getMonth();
    const diaAtual = dataAtual.getDate();

    const anoNascimento = this.dataNascimento.getFullYear();
    const mesNascimento = this.dataNascimento.getMonth();
    const diaNascimento = this.dataNascimento.getDate();

    let idade = anoAtual - anoNascimento;

    const naoFezAniversario =
      mesAtual < mesNascimento ||
      (mesAtual === mesNascimento && diaAtual < diaNascimento);

    if (naoFezAniversario) {
      idade--;
    }

    return idade;
  }

  getBio() {
    return this.bio;
  }

  getInteresses() {
    return this.interesses;
  }

  getGenero() {
    return this.genero;
  }

  getEmail() {
    return this.email;
  }

  getCpf() {
    return this.cpf;
  }

  getImagem() {
    return this.imagem;
  }

  getSenha() {
    return this.senha;
  }

  getDataNascimento() {
    return this.dataNascimento.toISOString().slice(0, 10);
  }
}

module.exports = { Usuario, generos };
