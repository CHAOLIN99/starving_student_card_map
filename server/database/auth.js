// use authCollection to track username, authtoken
const { collections, ensureConnection } = require("./db");

async function loginUser(userId, tokenSignature) {
  await ensureConnection();
  await collections.authCollection.insertOne({ tokenSignature, userId });
}

async function isLoggedIn(tokenSignature) {
  await ensureConnection();
  const result = await collections.authCollection.findOne({ tokenSignature });
  return !!result;
}

async function logoutUser(tokenSignature) {
  await ensureConnection();
  await collections.authCollection.deleteOne({ tokenSignature });
}

module.exports = {
  authDB: {
    loginUser,
    isLoggedIn,
    logoutUser,
  },
};
