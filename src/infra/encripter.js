const bcrypt = require("bcryptjs");

class Encripter {
  async hash(senha) {
    const salt = 10;
    return bcrypt.hash(senha, salt);
  }

  async compare(senha, hash) {
    return await bcrypt.compare(senha, hash);
  }
}

module.exports = { Encripter };
