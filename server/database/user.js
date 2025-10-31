// use userCollection to add user data (username, password, redemptions -> (deal_id, user_uses?))
const { collections, ensureConnection } = require("./db");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

async function createUser(userData) {
  await ensureConnection();
  const { username, password, role } = userData;
  if (!username || !password || !role) {
    throw new Error("Username, password, and role are required");
  }

  const existingUser = await collections.userCollection.findOne({ username });
  if (existingUser) {
    throw new Error("Username already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuid.v4(),
    username,
    role,
    passwordHash,
  };

  await collections.userCollection.insertOne(newUser);
  return { id: newUser.id, username: newUser.username, role: newUser.role };

async function getUserByUsername(username) {
  await ensureConnection();
  return await collections.userCollection.findOne(
    { username },
    { projection: { _id: 0 } }
  );
}

async function getUserById(id) {
  await ensureConnection();
  return await collections.userCollection.findOne(
    { id },
    { projection: { _id: 0, passwordHash: 0 } }
  );
}

async function verifyUser(username, password) {
  const user = await getUserByUsername(username);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error("Invalid credentials");
  }
  return { id: user.id, username: user.username, role: user.role };
}

async function updateUser(id, updates) {
  await ensureConnection();
  const updateFields = {};
  if (updates.username) updateFields.username = updates.username;
  if (updates.role) updateFields.role = updates.role;
  if (updates.password) {
    updateFields.passwordHash = await bcrypt.hash(updates.password, 10);
  }

  const result = await collections.userCollection.updateOne(
    { id },
    { $set: updateFields }
  );
  if (result.matchedCount === 0) {
    throw new Error("User not found");
  }

  return await getUserById(id);
}

async function getUsers(page = 0, limit = 10, usernameFilter = "*") {
  await ensureConnection();
  const skip = page * limit;
  const regexFilter = new RegExp(usernameFilter.replace(/\*/g, ".*"), "i");

  const users = await collections.userCollection
    .find(
      { username: { $regex: regexFilter } },
      { projection: { _id: 0, passwordHash: 0 } }
    )
    .skip(skip)
    .limit(limit + 1)
    .toArray();

  const more = users.length > limit;
  if (more) users.pop();

  return [users, more];
}

async function deleteUser(id) {
  await ensureConnection();
  const result = await collections.userCollection.deleteOne({ id });
  return result.deletedCount > 0;
}

module.exports = {
  userDB: {
    createUser,
    getUserByUsername,
    getUserById,
    verifyUser,
    updateUser,
    getUsers,
    deleteUser,
  },
};
