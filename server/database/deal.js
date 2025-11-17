const { collections, ensureConnection } = require("./db");

async function getDeal(id) {
  await ensureConnection();
  return collections.dealCollection.findOne(
    { id: id },
    { projection: { _id: 0 } }
  );
}

async function updateDeal(deal) {
  await ensureConnection();
  const result = await collections.dealCollection.updateOne(
    { id: deal.id },
    { $set: deal }
  );
  return result.matchedCount;
}

async function getAllDeals() {
  await ensureConnection();
  return await collections.dealCollection
    .find({}, { projection: { _id: 0 } })
    .toArray();
}

async function deleteDeal(id) {
  await ensureConnection();
  const result = await collections.dealCollection.deleteOne({ id: id });
  // console.log(result);
  return result.deletedCount;
}

async function createDeal(deal) {
  await ensureConnection();
  await collections.dealCollection.insertOne(deal);
}

async function createDeals(dealArray) {
  await ensureConnection();
  await collections.dealCollection.insertMany(dealArray);
}

module.exports = {
  dealDB: {
    getDeal,
    getAllDeals,
    createDeal,
    createDeals,
    deleteDeal,
    updateDeal,
  },
};
