const express = require('express');
const { registerUser, loginUser, getUserData } = require('../service/AuthService');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { user_id, user_type, phone_no, email, password } = req.body;
    const result = await registerUser(user_id, user_type, phone_no, email, password);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', data: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone_no:phone_no, password } = req.body;
    console.log(req.body)
    console.log("authentication.js :: "+phone_no+" "+password)
    const token = await loginUser(phone_no, password);
    res.status(200).json({ status: 'success', data: token });
  } catch (error) {
    res.status(500).json({ status: 'error', data: error.message });
  }
});

router.get('/user', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userData = await getUserData(token);
    res.status(200).json({ status: 'success', data: userData });
  } catch (error) {
    res.status(500).json({ status: 'error', data: error.message });
  }
});

module.exports = router;