// use redemption collection to track username, deal_id, num_uses
const { collections } = require("./db");
const { dealDB } = require("./deal");

const redemptionCollection = collections.redemptionCollection;

async function getRedemptionsForUser(userId) {
  return redemptionCollection
    .find({ userId }, { projection: { _id: 0 } })
    .toArray();
}

async function redeemDeal(userId, dealId) {
  const deal = await dealDB.getDeal(dealId);
  if (!deal) throw new Error("Deal not found");

  let redemption = await redemptionCollection.findOne({ userId, dealId });
  if (!redemption) {
    redemption = { userId, dealId, uses: 0 };
    await redemptionCollection.insertOne(redemption);
  }

  if (deal.numUses !== null && redemption.uses >= deal.numUses) {
    throw new Error("Redemption limit reached");
  }

  await redemptionCollection.updateOne(
    { userId, dealId },
    { $inc: { uses: 1 } }
  );
  return { success: true, newUses: redemption.uses + 1 };
}

// Add getRedemption(userId, dealId), etc.

module.exports = {
  redemptionDB: { getRedemptionsForUser, redeemDeal /* etc. */ },
};
