const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'g889f332'; 
const jwtExpiresIn = 86400; 

const register = async (userData) => {
    const userExists = await User.findOne({ username: userData.username });
    const emailExists = await User.findOne({ email: userData.email });

    if (userExists || emailExists) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

 
    const user = new User({
        ...userData,
        password: hashedPassword,
    });

    await user.save();


    const token = jwt.sign({
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
    }, jwtSecret, { expiresIn: jwtExpiresIn });

    return { user, token };
};

const login = async (username, password) => {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('User not found');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid password');
    }

    // Create token
    const token = jwt.sign({
        id: user._id,
        username: user.username,
        role: user.role,
    }, jwtSecret, { expiresIn: jwtExpiresIn });

    return { user, token };
};

module.exports = {
    register,
    login,
};
