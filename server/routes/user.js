const express = require("express");

const userRouter = express.Router();

//update singular deal
user.get("/userId:/redeemed", (req, res) => {
  res.send({ message: `Getting user '${userid}' redeemed deals!` });
});

//all deals
deal.get("/", (req, res) => {
  res.send({ message: "Getting all deals" });
});

//add new deal
deal.post("/", (req, res) => {
  res.send({ message: "Adding deal!" });
});

//update deal
deal.put("/:id", (req, res) => {
  res.send({ message: "Updating deal!" });
});
