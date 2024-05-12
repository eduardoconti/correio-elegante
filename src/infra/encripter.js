const bcrypt = require("bcryptjs");

class Encripter {
  async hash(senha) {
    try {
      const salt = 10;
      return bcrypt.hash(senha, salt);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = { Encripter };
