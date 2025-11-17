const express = require("express");
const { userDB } = require("../database/user");
const { authRouter, setAuth } = require("./auth");

const userRouter = express.Router();

userRouter.endpoints = [
  {
    method: "GET",
    path: "/api/user/me",
    requiresAuth: true,
    description: "Get authenticated user",
    example: `curl -X GET localhost:3000/api/user/me -H 'Authorization: Bearer tttttt'`,
    response: { id: "uuid", username: "user", role: "user" },
  },
  {
    method: "PUT",
    path: "/api/user/:userId",
    requiresAuth: true,
    description: "Update user",
    example: `curl -X PUT localhost:3000/api/user/uuid -d '{"username":"newname", "password":"newpass"}' -H 'Content-Type: application/json' -H 'Authorization: Bearer tttttt'`,
    response: {
      user: { id: "uuid", username: "newname", role: "user" },
      token: "tttttt",
    },
  },
  {
    method: "GET",
    path: "/api/user",
    requiresAuth: true,
    description: "List users (admin only)",
    example: `curl -X GET localhost:3000/api/user?page=0&limit=10&username=* -H 'Authorization: Bearer tttttt'`,
    response: { users: [], more: false },
  },
  {
    method: "DELETE",
    path: "/api/user/:userId",
    requiresAuth: true,
    description: "Delete user (admin only)",
    example: `curl -X DELETE localhost:3000/api/user/uuid -H 'Authorization: Bearer tttttt'`,
    response: { success: true },
  },
];

// Get authenticated user
userRouter.get("/me", authRouter.authenticateToken, async (req, res) => {
  res.send(req.user);
});

// Update user
userRouter.put("/:userId", authRouter.authenticateToken, async (req, res) => {
  const userId = req.params.userId;
  const updates = req.body;
  const user = req.user;

  if (user.id !== userId && !user.isRole("admin")) {
    return res.status(403).send({ message: "Unauthorized" });
  }

  const updatedUser = await userDB.updateUser(userId, updates);
  const token = await setAuth(updatedUser);
  res.send({ user: updatedUser, token });
});

// List users (admin only)
userRouter.get("/", authRouter.authenticateToken, async (req, res) => {
  const user = req.user;
  if (!user.isRole("admin")) {
    return res.status(403).send({ message: "Unauthorized" });
  }

  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const usernameFilter = req.query.username || "*";

  const [users, more] = await userDB.getUsers(page, limit, usernameFilter);
  res.send({ users, more });
});

// Delete user (admin only)
userRouter.delete(
  "/:userId",
  authRouter.authenticateToken,
  async (req, res) => {
    const user = req.user;
    if (!user.isRole("admin")) {
      return res.status(403).send({ message: "Unauthorized" });
    }

    const userId = req.params.userId;
    const success = await userDB.deleteUser(userId);
    if (success) {
      res.send({ success: true });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  }
);

module.exports = userRouter;
