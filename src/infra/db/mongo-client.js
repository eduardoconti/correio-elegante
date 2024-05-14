const { MongoClient } = require("mongodb");
const url = "mongodb://mongodb:27017";
const client = new MongoClient(url);

async function connectMongo() {
  try {
    console.log("Conectado MongoDB");
    await client.connect({
      reconnectTries: 60,
      reconnectInterval: 1000,
    });
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = { client, connectMongo };
