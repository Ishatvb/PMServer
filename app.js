const express = require("express");
require('dotenv').config();

const app = express();
app.use(express.json()); // Use built-in middleware for parsing JSON

const auth_router = require("./controllers/Authentication");

app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

app.use("/auth", auth_router);

app.listen(process.env.SERVER_PORT, () => {
  console.log("Node js server started.");
});