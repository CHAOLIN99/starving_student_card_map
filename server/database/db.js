const { MongoClient } = require("mongodb");

const uri =
  process.env.MONGODB_URI ||
  (() => {
    // fallback if you're using dbConfig.json locally
    try {
      const config = require("./dbConfig.json");
      const user = encodeURIComponent(config.userName);
      const pass = encodeURIComponent(config.password);
      const host = config.hostname;
      return `mongodb+srv://${user}:${pass}@${host}/?retryWrites=true&w=majority`;
    } catch {
      throw new Error(
        "Missing MONGODB_URI env variable and no dbConfig.json was found."
      );
    }
  })();

// Global cached client for Vercel serverless reuse
let cached = global._mongo || { client: null, db: null };

async function connect() {
  if (cached.client && cached.db) {
    return cached; // Reuse existing connection
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db("map_starving_db_v1");

  cached.client = client;
  cached.db = db;
  global._mongo = cached; // persist in serverless runtime

  return cached;
}

async function getDb() {
  const { db } = await connect();
  return db;
}

async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}

module.exports = {
  connect,
  getDb,
  getCollection,
};
