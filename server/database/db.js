const { MongoClient } = require("mongodb");
const config = require("./dbConfig.json");

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db("map_starving_db_v1");

const userCollection = db.collection("user");
const dealCollection = db.collection("deal");
const redemptionCollection = db.collection("redemption");
const authCollection = db.collection("auth");

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log("Connected to database");
  } catch (ex) {
    console.log(`Unable to connect to database ${url} because ${ex.message}`);
  }
})();

module.exports = {
  client,
  db,
  collections: {
    dealCollection,
  },
};
