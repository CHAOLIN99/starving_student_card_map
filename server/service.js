const express = require("express");
const dealRouter = require("./routes/deal.js");

const app = express();
app.use(express.json());

const apiRouter = express.Router();
app.use("/api", apiRouter);
apiRouter.use("/deal", dealRouter);

app.get("/", (req, res) => {
  res.json({
    message: "welcome to the Starving student card map!",
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
