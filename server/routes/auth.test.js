const request = require("supertest");
const app = require("../service");

if (process.env.VSCODE_INSPECTOR_OPTIONS) {
  jest.setTimeout(60 * 1000 * 5); // 5 minutes
}

function randomName() {
  return Math.random().toString(36).substring(2, 12);
}

const testUser = { username: "reg@test.com", password: "a", role: "user" };
let testUserAuthToken;

beforeAll(async () => {
  testUser.username = Math.random().toString(36).substring(2, 12) + "@test.com";
  const registerRes = await request(app).post("/api/auth").send(testUser);
  testUserAuthToken = registerRes.body.token;
  expectValidJwt(testUserAuthToken);
});

test("register", async () => {
  const newUser = {
    username: randomName() + "@test.com",
    password: "password123",
    role: "user",
  };

  const registerRes = await request(app).post("/api/auth").send(newUser);
  expect(registerRes.status).toBe(200);
  expect(registerRes.body.user.username).toBe(newUser.username);
  expect(registerRes.body.user.role).toBe(newUser.role);
  expect(registerRes.body.user.passwordHash).toBeUndefined();
  expectValidJwt(registerRes.body.token);
});

test("register with missing fields", async () => {
  // Missing username
  let registerRes = await request(app).post("/api/auth").send({
    password: "password123",
    role: "user",
  });
  expect(registerRes.status).toBe(400);
  expect(registerRes.body.message).toBe(
    "Username, password, and role are required"
  );

  // Missing password
  registerRes = await request(app)
    .post("/api/auth")
    .send({
      username: randomName() + "@test.com",
      role: "user",
    });
  expect(registerRes.status).toBe(400);
  expect(registerRes.body.message).toBe(
    "Username, password, and role are required"
  );

  // Missing role
  registerRes = await request(app)
    .post("/api/auth")
    .send({
      username: randomName() + "@test.com",
      password: "password123",
    });
  expect(registerRes.status).toBe(400);
  expect(registerRes.body.message).toBe(
    "Username, password, and role are required"
  );
});

test("login", async () => {
  const loginRes = await request(app).put("/api/auth").send({
    username: testUser.username,
    password: testUser.password,
  });
  expect(loginRes.status).toBe(200);
  expectValidJwt(loginRes.body.token);

  const expectedUser = {
    id: expect.any(String),
    username: testUser.username,
    role: testUser.role,
  };
  expect(loginRes.body.user).toMatchObject(expectedUser);
});

test("login with wrong password", async () => {
  const loginRes = await request(app).put("/api/auth").send({
    username: testUser.username,
    password: "wrongpassword",
  });
  expect(loginRes.status).toBe(401);
  expect(loginRes.body.message).toBe("Invalid credentials");
});

test("login with non-existent user", async () => {
  const loginRes = await request(app).put("/api/auth").send({
    username: "nonexistent@test.com",
    password: "password",
  });
  expect(loginRes.status).toBe(401);
  expect(loginRes.body.message).toBe("Invalid credentials");
});

test("logout", async () => {
  const logoutRes = await request(app)
    .delete("/api/auth")
    .set("Authorization", `Bearer ${testUserAuthToken}`);
  expect(logoutRes.status).toBe(200);
  expect(logoutRes.body.message).toBe("logout successful");
});

test("logout without token", async () => {
  const logoutRes = await request(app).delete("/api/auth");
  expect(logoutRes.status).toBe(401);
  expect(logoutRes.body.message).toBe("Unauthorized");
});

test("logout with invalid token", async () => {
  const logoutRes = await request(app)
    .delete("/api/auth")
    .set("Authorization", "Bearer invalid.token.here");
  expect(logoutRes.status).toBe(401);
  expect(logoutRes.body.message).toBe("Unauthorized");
});

function expectValidJwt(potentialJwt) {
  expect(potentialJwt).toMatch(
    /^[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*$/
  );
}
