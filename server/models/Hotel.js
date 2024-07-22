const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    longitude: {
        type: String,
    },
    latitude: {
        type: String,
    },
    cheapestPrice: {
        type: Number,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    amenities: [{
        type: String,
        enum: ['wifi', 'parking', 'pool', 'gym', 'spa', 'restaurant', 'bar', 'airport shuttle', 'concierge', 'room service', 'non-smoking rooms', 'pet-friendly', 'laundry service', 'air conditioning', 'meeting rooms']
    }],
    images: [String],
    rooms: [{
        type: Schema.Types.ObjectId,
        ref: 'Room'
    }],
    cityId: {
        type: Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalRevenueGenerated: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
