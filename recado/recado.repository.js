class RecadoRepository {
  collection;

  constructor(client) {
    const db = client.db("correio");
    this.collection = db.collection("recado");
  }

  async save(recado) {
    try {
      await this.collection.insertOne(recado);
    } catch (error) {
      console.log(error);
    }
  }

  async find() {
    try {
      return await this.collection.find().toArray();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = { RecadoRepository };
