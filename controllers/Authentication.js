const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserData } = require("../service/AuthService");

router.post("/register", async (req, res) => {
    const { name, mobile, age, password } = req.body;

    try {
        const result = await registerUser(name, mobile, age, password);
        res.send({ status: "ok", data: result });
    } catch (error) {
        res.send({ status: "error", data: error.message });
    }
});

router.post("/login-user", async (req, res) => {
    const { mobile, password } = req.body;

    try {
        const token = await loginUser(mobile, password);
        res.status(201).send({ status: "ok", data: token });
    } catch (error) {
        res.send({ status: "error", data: error.message });
    }
});

router.post("/userdata", async (req, res) => {
    const { token } = req.body;

    try {
        const data = await getUserData(token);
        res.send({ status: "ok", data: data });
    } catch (error) {
        res.send({ status: "error", data: error.message });
    }
});

module.exports = router;