// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, 
        lowercase: true, 
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    role: {
        type: String,
        enum: ['admin', 'client', 'seller'],
        default: 'client',
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    contactNumber: {
        type: String,
        required: false,
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please fill a valid contact number'], 
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
