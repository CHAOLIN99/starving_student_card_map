const request = require("supertest");
const app = require("../service");
const { userDB } = require("../database/user");

if (process.env.VSCODE_INSPECTOR_OPTIONS) {
  jest.setTimeout(60 * 1000 * 5); // 5 minutes
}

function randomName() {
  return Math.random().toString(36).substring(2, 12);
}

async function createAdminUser() {
  const user = {
    username: randomName() + "@admin.com",
    password: "toomanysecrets",
    role: "admin",
  };
  return await userDB.createUser(user);
}

let adminUser;
let adminToken;
let testUser;
let testUserToken;
let otherUser;

beforeAll(async () => {
  // Create admin user
  adminUser = await createAdminUser();
  const adminLoginRes = await request(app).put("/api/auth").send({
    username: adminUser.username,
    password: "toomanysecrets",
  });
  adminToken = adminLoginRes.body.token;

  // Create regular user
  testUser = {
    username: randomName() + "@test.com",
    password: "password123",
    role: "user",
  };
  const testUserRes = await request(app).post("/api/auth").send(testUser);
  testUserToken = testUserRes.body.token;
  testUser.id = testUserRes.body.user.id;

  // Create another regular user
  otherUser = {
    username: randomName() + "@test.com",
    password: "password456",
    role: "user",
  };
  const otherUserRes = await request(app).post("/api/auth").send(otherUser);
  otherUser.id = otherUserRes.body.user.id;
});

afterAll(async () => {
  // Optional cleanup
  await userDB.deleteUser(adminUser.id);
  await userDB.deleteUser(testUser.id);
  await userDB.deleteUser(otherUser.id);
});

describe("getUser", () => {
  test("get authenticated user profile", async () => {
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", `Bearer ${testUserToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(testUser.id);
    expect(res.body.username).toBe(testUser.username);
    expect(res.body.role).toBe("user");
    expect(res.body.passwordHash).toBeUndefined();
  });

  test("get user profile without auth", async () => {
    const res = await request(app).get("/api/user/me");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  test("get user profile with invalid token", async () => {
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", "Bearer invalid.token.here");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });
});

describe("updateUser", () => {
  test("update own user profile", async () => {
    const updates = {
      username: randomName() + "@updated.com",
      password: "newpassword",
    };

    const res = await request(app)
      .put(`/api/user/${testUser.id}`)
      .set("Authorization", `Bearer ${testUserToken}`)
      .send(updates);

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(testUser.id);
    expect(res.body.user.username).toBe(updates.username);
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.body).toHaveProperty("token");

    testUser.username = updates.username;
    testUser.password = updates.password;
    testUserToken = res.body.token;
  });

  test("update user as admin", async () => {
    const updates = {
      username: randomName() + "@admin-updated.com",
    };

    const res = await request(app)
      .put(`/api/user/${otherUser.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updates);

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(otherUser.id);
    expect(res.body.user.username).toBe(updates.username);
    expect(res.body).toHaveProperty("token");
  });

  test("update other user without admin role", async () => {
    const updates = {
      username: randomName() + "@unauthorized.com",
    };

    const res = await request(app)
      .put(`/api/user/${adminUser.id}`)
      .set("Authorization", `Bearer ${testUserToken}`)
      .send(updates);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Unauthorized");
  });

  test("update user without auth", async () => {
    const updates = {
      username: randomName() + "@noauth.com",
    };

    const res = await request(app)
      .put(`/api/user/${testUser.id}`)
      .send(updates);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  test("update user with partial data", async () => {
    const partialTestUser = {
      username: randomName() + "@partial.com",
      password: "partialpass",
      role: "user",
    };

    const registerRes = await request(app)
      .post("/api/auth")
      .send(partialTestUser);
    const userId = registerRes.body.user.id;
    const token = registerRes.body.token;

    const updates = {
      username: randomName() + "@partial-updated.com",
    };

    const res = await request(app)
      .put(`/api/user/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updates);

    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe(updates.username);

    // Cleanup
    await userDB.deleteUser(userId);
  });

  test("verify login with updated credentials", async () => {
    const freshUser = {
      username: randomName() + "@fresh.com",
      password: "initialpass",
      role: "user",
    };

    // Register fresh user
    const registerRes = await request(app).post("/api/auth").send(freshUser);
    expect(registerRes.status).toBe(200);

    const userId = registerRes.body.user.id;
    const token = registerRes.body.token;

    // Update the user's password
    const newPassword = "updatedpass";
    const updateRes = await request(app)
      .put(`/api/user/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: newPassword,
      });

    expect(updateRes.status).toBe(200);

    // Login with the updated credentials
    const loginRes = await request(app).put("/api/auth").send({
      username: freshUser.username,
      password: newPassword,
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.user.username).toBe(freshUser.username);

    // Cleanup
    await userDB.deleteUser(userId);
  });
});

describe("listUsers", () => {
  test("list users unauthorized", async () => {
    const listUsersRes = await request(app).get("/api/user");
    expect(listUsersRes.status).toBe(401);
  });

  test("list users", async () => {
    const listUsersRes = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(listUsersRes.status).toBe(200);
    expect(listUsersRes.body).toHaveProperty("users");
    expect(listUsersRes.body).toHaveProperty("more");
  });

  test("get users with pagination", async () => {
    const listUsersRes = await request(app)
      .get("/api/user?page=0&limit=2")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(listUsersRes.status).toBe(200);
    expect(listUsersRes.body.users.length).toBeLessThanOrEqual(2);
    expect(listUsersRes.body).toHaveProperty("more");
  });

  test("get users with username filter", async () => {
    const listUsersRes = await request(app)
      .get(`/api/user?username=${testUser.username}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(listUsersRes.status).toBe(200);
    expect(listUsersRes.body.users.length).toBeGreaterThan(0);
    expect(listUsersRes.body.users[0].username).toBe(testUser.username);
  });
});

describe("deleteUser", () => {
  test("delete user as admin", async () => {
    const newUserRes = await registerUser(request(app));
    const newUser = newUserRes[0];
    const deleteRes = await request(app)
      .delete(`/api/user/${newUser.id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });

  test("delete user unauthorized", async () => {
    const deleteRes = await request(app)
      .delete(`/api/user/${otherUser.id}`)
      .set("Authorization", `Bearer ${testUserToken}`);
    expect(deleteRes.status).toBe(403);
  });
});

async function registerUser(service) {
  const testUser = {
    username: `${randomName()}@test.com`,
    password: "a",
    role: "user",
  };
  const registerRes = await service.post("/api/auth").send(testUser);
  return [registerRes.body.user, registerRes.body.token];
}
