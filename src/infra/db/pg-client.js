const { Pool } = require("pg");

class Singleton {
  constructor(connectionString) {
    if (!Singleton.instances) {
      Singleton.instances = {};
    }
    if (!Singleton.instances[connectionString]) {
      const pool = this.createPool(connectionString);
      Singleton.instances[connectionString] = pool;
    }
  }

  getInstance(connectionString) {
    return Singleton.instances[connectionString];
  }

  createPool(connectionString) {
    const pool = new Pool({ connectionString });

    pool.on("error", (err, client) => {
      console.error("Unexpected error on idle client");
      setTimeout(() => {
        console.log("Attempting to reconnect...: ");
        Singleton.instances[connectionString] =
          this.createPool(connectionString);
      }, 5000);
    });

    pool.on("connect", () => {
      console.log("Connectado postgres");
    });

    return pool;
  }
}

const connectPostgres = new Singleton(
  process.env.CONNECTION_STRING
).getInstance(process.env.CONNECTION_STRING);

module.exports = { connectPostgres };
