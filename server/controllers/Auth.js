// controllers/authController.js
const authService = require('../services/Auth');

const registerUser = async (req, res) => {
    try {
        const { user, token } = await authService.register(req.body);
        res.status(201).json({ message: "User created successfully", user, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const { user, token } = await authService.login(username, password);
        res.json({ message: "User logged in successfully", user, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
