const jwt = require("jsonwebtoken");
class JWTService {
  sign(payload) {
    return jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: "7d",
    });
  }

  verify(token) {
    return jwt.verify(token, process.env.JWT_KEY, {
      ignoreExpiration: true,
    });
  }
}

module.exports = { JWTService };
