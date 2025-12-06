const { MongoClient } = require("mongodb");
const config = require("./dbConfig.json");

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}` ;

const client = new MongoClient(url);
let db;
let userCollection;
let dealCollection;
let redemptionCollection;
let authCollection;

// Connection promise to ensure we connect before operations
const connectionPromise = (async function initializeConnection() {
  try {
    await client.connect();
    db = client.db("map_starving_db_v1");

    userCollection = db.collection("user");
    dealCollection = db.collection("deal");
    redemptionCollection = db.collection("redemption");
    authCollection = db.collection("auth");

    await db.command({ ping: 1 });
    console.log("Connected to database");
  } catch (ex) {
    console.log(`Unable to connect to database ${url} because ${ex.message}`);
    throw ex;
  }
})();

// Function to ensure connection before operations
async function ensureConnection() {
  await connectionPromise;
}

module.exports = {
  client,
  get db() {
    return db;
  },
  collections: {
    get userCollection() {
      return userCollection;
    },
    get dealCollection() {
      return dealCollection;
    },
    get redemptionCollection() {
      return redemptionCollection;
    },
    get authCollection() {
      return authCollection;
    },
  },
  ensureConnection,
};
