const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new Schema({
    city: {
        type: String,
        required: true,
        trim: true
    },
    lat: {
        type: String,
        required: true,
        trim: true
    },
    lng: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    iso2: {
        type: String,
        required: true,
        trim: true
    },
    admin_name: {
        type: String,
        required: true,
        trim: true
    },
    capital: {
        type: String,
        trim: true,
        default: ""
    },
    population: {
        type: Number,
        default: 0
    },
    population_proper: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);
