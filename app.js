const express= require("express");
const app=express();
const mongoose=require("mongoose");
app.use(express.json());
import auth_router from "./controllers/authentication";
// const bcrypt = require("bcryptjs");
// const jwt=require('jsonwebtoken');

const mongoUrl ="mongodb+srv://beoharishatv7470:medicinereminderadmin@cluster0.rlinx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// const JWT_SECRET = "hvdvay6ert72839289()aiy8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

mongoose
.connect(mongoUrl)
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

app.listen(5050,()=>{
    console.log("Node js server started.");
});

