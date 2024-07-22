// models/Inventory.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    datesBooked: [{
        type: Date,
        required: true
    }],
    availableQuantity: {
        type: Number,
        required: true,
    },
    reservedQuantity: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
