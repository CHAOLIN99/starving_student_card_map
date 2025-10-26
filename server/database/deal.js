const { collections } = require("./db");

const dealCollection = collections.dealCollection;

async function getDeal(id) {
  return dealCollection.findOne({ id: id }, { projection: { _id: 0 } });
}

async function updateDeal(deal) {
  const result = await dealCollection.updateOne(
    { id: deal.id },
    { $set: deal }
  );
  return result.matchedCount;
}

async function getAllDeals() {
  return await dealCollection.find({}, { projection: { _id: 0 } }).toArray();
}

async function deleteDeal(id) {
  const result = await dealCollection.deleteOne({ id: id });
  // console.log(result);
  return result.deletedCount;
}

function createDeal(deal) {
  dealCollection.insertOne(deal);
}

function createDeals(dealArray) {
  dealCollection.insertMany(dealArray);
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
