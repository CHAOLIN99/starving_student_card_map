// server/database/db.js
const { MongoClient, ServerApiVersion } = require("mongodb");

// Use environment variables in production, fallback to config file in development
let config;
if (process.env.MONGODB_HOSTNAME) {
  // Production (Vercel) - use environment variables
  config = {
    userName: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    hostname: process.env.MONGODB_HOSTNAME
  };
} else {
  // Development - use local config file
  config = require("./dbConfig.json");
}

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}/?appName=Cluster0`;

// Create client with Stable API version
const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

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