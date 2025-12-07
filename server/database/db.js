const { MongoClient } = require("mongodb");

let config = {};
try {
  config = require("./dbConfig.json");
} catch (e) {
  console.log("No dbConfig.json found, using environment variables");
}

const userName = config.userName || process.env.MONGOUSER;
const password = config.password || process.env.MONGOPASSWORD;
const hostname = config.hostname || process.env.MONGOHOSTNAME;

// URL-encode the username and password to handle special characters
const encodedUserName = encodeURIComponent(userName);
const encodedPassword = encodeURIComponent(password);

console.log("userName:", userName);
console.log("hostname:", hostname);

const url = `mongodb+srv://${encodedUserName}:${encodedPassword}@${hostname}`;

console.log("Constructed URL:", url.replace(encodedPassword, "***PASSWORD***"));

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
    console.log(`Unable to connect to database because ${ex.message}`);
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