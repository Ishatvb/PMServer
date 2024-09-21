const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require('dotenv').config();

const bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken');

require("../UserDetails");

const User = mongoose.model("UserInfo");

const JWT_SECRET = process.env.JWT_SECRET
router.post("/register",async(req, res) => {
    const {name, mobile, age, password}=req.body;

    console.log(name, mobile, age, password);

    const oldUser=await User.findOne({mobile:mobile});

    if(oldUser){
        return res.send({data: "user already exists!!!"});
    }
    const encryptedPassword = await bcrypt.hash(password,10);

    try{
        await User.create({
            name: name,
            age: age,
            mobile: mobile,
            password: encryptedPassword,
        });
        res.send({status:"ok", data: "User Created"});
    }catch(error){
        res.send({status: "error", data: error});
    }
});

router.post("/login-user", async(req, res)=>{
    const {mobile, password} = req.body;
    const oldUser = await User.findOne({mobile:mobile});

    if(!oldUser){
        return res.send({data:"User doesn't exists !!!"})
    }

    if(await bcrypt.compare(password, oldUser.password)){
        const token=jwt.sign({mobile:oldUser.mobile}, JWT_SECRET);
    
        if(res.status(201)){
            return res.send({status: "ok", data: token});
        }
        else{
            return res.send({error: "error"});
        }
    }
    else{
        return res.send({data: "Password is incorrect"});
    }
});


router.post("/userdata", async (req, res) => {
    const { token } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET);
      const usermobile = user.mobile;
  
      User.findOne({ mobile: usermobile }).then((data) => {
        return res.send({ status: "Ok", data: data });
      });
    } catch (error) {
      return res.send({ error: error });
    }
  });

module.exports = router;