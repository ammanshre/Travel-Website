// models/Room.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['single', 'double', 'suite', 'deluxe', 'presidential'],
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    amenities: [{
        type: String,
        enum: ['wifi', 'air conditioning', 'mini-bar', 'room safe', 'television', 'room service']
    }],
    images: [String],
    description: {
        type: String,
        trim: true,
    },
    inventory: [{
        type: Schema.Types.ObjectId,
        ref: 'Inventory'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
