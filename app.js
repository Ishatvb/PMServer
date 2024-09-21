const express= require("express");

const mongoose=require("mongoose");
require('dotenv').config();

const app=express();
app.use(express.json());

const auth_router = require("./controllers/Authentication");

const MONGO_URL = process.env.MONGO_URL;

mongoose
.connect(MONGO_URL)
.then(()=>{
    console.log("Database connected");
})
.catch((e)=>{
    console.log(e);
});
require('./UserDetails')
const User=mongoose.model("UserInfo");

app.get("/",(req, res)=>{
    res.send({status:"Started"})
});

app.use("/auth", auth_router);

app.listen(process.env.SERVER_PORT,()=>{
    console.log("Node js server started.");
});

