// models/Taxi.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taxiSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    make: {
        type: String,
        required: true,
        trim: true,
    },
    model: {
        type: String,
        required: true,
        trim: true,
    },
    year: {
        type: Number,
        required: true,
    },
    licensePlate: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    color: {
        type: String,
        required: true,
        trim: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    ratePerKm: {
        type: Number,
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true,
    }
}, { timestamps: true });

taxiSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Taxi', taxiSchema);
