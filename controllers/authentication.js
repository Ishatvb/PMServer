import express from "express"
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken');

const JWT_SECRET = "hvdvay6ert72839289()aiy8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

router.post("/register",async(req, res) => {
    const {name, mobile, age, password}=req.body;

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

  export default auth_router;