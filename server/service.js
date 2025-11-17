const express = require("express");
const dealRouter = require("./routes/deal.js");
const userRouter = require("./routes/user");
const { authRouter, setAuthUser } = require("./routes/auth");
const config = require("./config.js");
const version = { version: "1.0.0" };

const app = express();
app.use(express.json());
app.use(setAuthUser);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

const apiRouter = express.Router();
app.use("/api", apiRouter);

apiRouter.use("/docs", (req, res) => {
  res.json({
    version: version.version,
    endpoints: [
      ...authRouter.endpoints,
      ...userRouter.endpoints,
      ...dealRouter.endpoints,
    ],
  });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/deal", dealRouter);

app.get("/", (req, res) => {
  res.json({
    message: "welcome to the Starving student card map!",
    version: version.version,
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "unknown endpoint",
  });
});

app.use((err, req, res, next) => {
  res
    .status(err.status ?? 500)
    .json({ message: err.message, stack: err.stack });
});

module.exports = app;
