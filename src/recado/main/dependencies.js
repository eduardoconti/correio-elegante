const { container } = require("../../infra/container/container");
const { client } = require("../../infra/db/mongo-client");
const { RecadoRepository } = require("../recado.repository");

const recadoModule = () => {
  container.register("recadoRepository", () => new RecadoRepository(client));
};

module.exports = { recadoModule };
