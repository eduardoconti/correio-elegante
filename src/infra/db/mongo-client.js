const { MongoClient } = require("mongodb");
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
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
