const express = require("express");
const jwt = require("jsonwebtoken");
const { userDB } = require("../database/user");
const { authDB } = require("../database/auth");
const config = require("../config.js");

const authRouter = express.Router();

authRouter.endpoints = [
  {
    method: "POST",
    path: "/api/auth",
    description: "Register a new user",
    example: `curl -X POST localhost:3000/api/auth -d '{"username":"user", "password":"pass", "role":"user"}' -H 'Content-Type: application/json'`,
    response: {
      user: { id: "uuid", username: "user", role: "user" },
      token: "tttttt",
    },
  },
  {
    method: "PUT",
    path: "/api/auth",
    description: "Login existing user",
    example: `curl -X PUT localhost:3000/api/auth -d '{"username":"user", "password":"pass"}' -H 'Content-Type: application/json'`,
    response: {
      user: { id: "uuid", username: "user", role: "user" },
      token: "tttttt",
    },
  },
  {
    method: "DELETE",
    path: "/api/auth",
    requiresAuth: true,
    description: "Logout a user",
    example: `curl -X DELETE localhost:3000/api/auth -H 'Authorization: Bearer tttttt'`,
    response: { message: "logout successful" },
  },
];

async function setAuthUser(req, res, next) {
  const token = readAuthToken(req);
  if (token) {
    try {
      const signature = getTokenSignature(token);
      if (await authDB.isLoggedIn(signature)) {
        req.user = jwt.verify(token, config.jwtSecret);
        req.user.isRole = (role) => req.user.role === role; // Simple role check (single role)
      }
    } catch (err) {
      req.user = null;
    }
  }
  next();
}

// Authenticate token middleware
authRouter.authenticateToken = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  next();
};

// Register
authRouter.post("/", async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res
      .status(400)
      .send({ message: "Username, password, and role are required" });
  }
  try {
    const user = await userDB.createUser({ username, password, role });
    const token = await setAuth(user);
    res.send({ user, token });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Login
authRouter.put("/", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Username and password are required" });
  }
  try {
    const user = await userDB.verifyUser(username, password);
    const token = await setAuth(user);
    res.send({ user, token });
  } catch (err) {
    res.status(401).send({ message: "Invalid credentials" });
  }
});

// Logout
authRouter.delete("/", authRouter.authenticateToken, async (req, res) => {
  const token = readAuthToken(req);
  if (token) {
    const signature = getTokenSignature(token);
    await authDB.logoutUser(signature);
  }
  res.send({ message: "logout successful" });
});

async function setAuth(user) {
  const token = jwt.sign(user, config.jwtSecret);
  const signature = getTokenSignature(token);
  await authDB.loginUser(user.id, signature);
  return token;
}

function readAuthToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      return parts[1];
    }
  }
  return null;
}

function getTokenSignature(token) {
  const parts = token.split(".");
  return parts.length === 3 ? parts[2] : "";
}

module.exports = { authRouter, setAuthUser, setAuth: setAuth };
