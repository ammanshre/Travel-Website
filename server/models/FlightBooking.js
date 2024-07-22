const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flightSegmentSchema = new Schema({
    departure: {
        iataCode: String,
        countryName: String,
        at: Date
    },
    arrival: {
        iataCode: String,
        countryName: String,
        at: Date
    },
    carrierCode: String,
    airlineLogo: String,
    duration: String,
    numberOfStops: Number,
    aircraft: {
        code: String,
        name: String
    }
});

const flightPricingSchema = new Schema({
    currency: String,
    total: Number,
    base: Number
});

const flightBookingSchema = new Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        }
    },
    itineraries: [
        {
            segments: [flightSegmentSchema]
        }
    ],
    price: flightPricingSchema,
    isPaid: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('FlightBooking', flightBookingSchema);
