const { container } = require("../container/container");
const { Encripter } = require("../encripter");
const { JWTService } = require("../jwt");

const infraModule = () => {
  container.register("encripter", () => new Encripter());
  container.register("jwtService", () => new JWTService());
};

module.exports = { infraModule };
