function getUrlImagem(imagem) {
  return `${process.env.API_HOST}/user-image/${imagem}`;
}

module.exports = { getUrlImagem };
