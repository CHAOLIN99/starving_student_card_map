const express = require("express");

const dealRouter = express.Router();

//update singular deal
dealRouter.get("/:dealID", (req, res) => {
  res.send({ message: `NOT IMPLEMENTED. Getting deal ${req.params.dealID}!` });
});

//all deals
dealRouter.get("/", (req, res) => {
  res.send({ message: "NOT IMPLEMENTED. Getting all deals" });
});

//add new deal
dealRouter.post("/", (req, res) => {
  res.send({ message: "NOT IMPLEMENTED. Adding new deal!" });
});

//update deal
dealRouter.put("/:dealID", (req, res) => {
  res.send({ message: `NOT IMPLEMENTED. Updating deal ${req.params.dealID}!` });
});

module.exports = dealRouter;
