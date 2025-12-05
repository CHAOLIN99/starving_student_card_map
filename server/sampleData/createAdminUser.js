const { userDB } = require("../database/user");
const { ensureConnection } = require("../database/db");

(async () => {
  try {
    await ensureConnection();
    const user = await userDB.createUser({
      username: "admin",
      password: "admin",
      role: "admin",
    });
    console.log("Admin user created:", user);
    process.exit(0);
  } catch (err) {
    console.error("Failed to create admin user:", err.message);
    process.exit(1);
  }
})();
