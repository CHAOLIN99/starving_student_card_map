const { client, collections } = require("../database/db");

const dealCollection = collections.dealCollection;

async function dropDeals() {
  try {
    const result = await dealCollection.drop();
    console.log(`Collection 'deal' dropped successfully:`, result);
  } catch (error) {
    console.error(`Error dropping database 'deal' ':`, error);
  } finally {
    await client.close();
    console.log("Disconnected from database");
  }
}

dropDeals();
client.close;
