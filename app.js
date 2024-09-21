const express = require("express");
require('dotenv').config();

const app = express();
app.use(express.json());

const auth_router = require("./controllers/Authentication");
require('./db_Access/DBSetup');

app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

app.use("/auth", auth_router);

app.listen(process.env.SERVER_PORT, () => {
  console.log("Node js server started.");
});