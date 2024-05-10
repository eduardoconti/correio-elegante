const { client } = require("../db/mongo-client");

class RecadoRepository {
  async save(recado) {
    try {
      await client.connect();
      const db = client.db("correio");
      const collection = db.collection("recado");
      await collection.insertOne(recado);
    } catch (error) {
      console.log(error);
    } finally {
      client.close();
    }
  }

  async find() {
    try {
      await client.connect();
      const db = client.db("correio");
      const collection = db.collection("recado");
      return await collection.find().toArray();
    } catch (error) {
      console.log(error);
    } finally {
      client.close();
    }
  }
}

module.exports = { RecadoRepository };
