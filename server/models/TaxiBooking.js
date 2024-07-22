// models/TaxiBooking.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taxiBookingSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    taxi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Taxi',
        required: true,
    },
    pickupLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
        address: {
            type: String,
            required: true,
            trim: true,
        }
    },
    dropoffLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], 
            required: true
        },
        address: {
            type: String,
            required: true,
            trim: true,
        }
    },
    bookingStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending',
    },
    fare: {
        type: Number,
        required: true,
    },
    distance: {
        type: Number,
        required: true,
    },
    bookingTime: {
        type: Date,
        default: Date.now,
    },
    rideTime: {
        type: Date,
    },
    completionTime: {
        type: Date,
    },
}, { timestamps: true });

taxiBookingSchema.index({ pickupLocation: '2dsphere' });
taxiBookingSchema.index({ dropoffLocation: '2dsphere' });

module.exports = mongoose.model('TaxiBooking', taxiBookingSchema);
