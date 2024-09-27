const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../db_access/User');

const JWT_SECRET = process.env.JWT_SECRET;

async function registerUser(user_id, user_type, phone_no, email, password) {
  try {
    console.log('Registering user with phone_no:', phone_no);

    if (!phone_no) {
      throw new Error('phone_no is required');
    }

    const oldUser = await User.findOne({ where: { phone_no: phone_no.toString() } });

    if (oldUser) {
      throw new Error('User already exists!!!');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await User.create({
      user_id,
      user_type,
      phone_no: phone_no.toString(),
      email,
      pwd_hash: encryptedPassword,
    });

    return 'User Created';
  } catch (error) {
    console.error('Error in registerUser:', error); // Debugging log
    throw error;
  }
}

async function loginUser(phone_no, password) {
  try {
    console.log('Logging in user with phone_no:', phone_no); // Debugging log

    const oldUser = await User.findOne({ where: { phone_no: phone_no.toString() } });

    if (!oldUser) {
      throw new Error("User doesn't exist!!!");
    }

    if (await bcrypt.compare(password, oldUser.pwd_hash)) {
      const token = jwt.sign({ phone_no: oldUser.phone_no }, JWT_SECRET);
      return token;
    } else {
      throw new Error('Password is incorrect');
    }
  } catch (error) {
    console.error('Error in loginUser:', error); // Debugging log
    throw error;
  }
}

async function getUserData(token) {
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const userPhoneNo = user.phone_no;

    console.log('Fetching data for user with phone_no:', userPhoneNo); // Debugging log

    const data = await User.findOne({ where: { phone_no: userPhoneNo.toString() } });
    return data;
  } catch (error) {
    console.error('Error in getUserData:', error); // Debugging log
    throw error;
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserData,
};