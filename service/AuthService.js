const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

require("../db_Access/UserDetails");

const User = mongoose.model("UserInfo");
const JWT_SECRET = process.env.JWT_SECRET;

async function registerUser(name, mobile, age, password) {
    const oldUser = await User.findOne({ mobile: mobile });

    if (oldUser) {
        throw new Error("User already exists!!!");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name: name,
        age: age,
        mobile: mobile,
        password: encryptedPassword,
    });

    return "User Created";
}

async function loginUser(mobile, password) {
    const oldUser = await User.findOne({ mobile: mobile });

    if (!oldUser) {
        throw new Error("User doesn't exist!!!");
    }

    if (await bcrypt.compare(password, oldUser.password)) {
        const token = jwt.sign({ mobile: oldUser.mobile }, JWT_SECRET);
        return token;
    } else {
        throw new Error("Password is incorrect");
    }
}

async function getUserData(token) {
    const user = jwt.verify(token, JWT_SECRET);
    const usermobile = user.mobile;

    const data = await User.findOne({ mobile: usermobile });
    return data;
}

module.exports = {
    registerUser,
    loginUser,
    getUserData,
};