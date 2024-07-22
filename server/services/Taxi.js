const Taxi = require('../models/Taxi');
const City = require('../models/City');
const TaxiBooking = require('../models/TaxiBooking');

const getTaxis = async () => {
    try {
        const taxis = await Taxi.find().populate('owner').populate('city');
        return taxis;
    } catch (error) {
        throw new Error('Failed to fetch taxis: ' + error.message);
    }
};

const getTaxiById = async (id) => {
    try {
        const taxi = await Taxi.findById(id).populate('owner').populate('city');
        if (!taxi) {
            throw new Error('Taxi not found');
        }
        return taxi;
    } catch (error) {
        throw new Error('Failed to fetch taxi: ' + error.message);
    }
};

const getTaxisByCity = async (cityId) => {
    try {
        const taxis = await Taxi.find({ city: cityId }).populate('owner').populate('city');
        if (!taxis.length) {
            throw new Error('No taxis found for this city');
        }
        return taxis;
    } catch (error) {
        throw new Error('Failed to fetch taxis: ' + error.message);
    }
};

const createTaxi = async (taxiData) => {
    const newTaxi = new Taxi(taxiData);
    await newTaxi.save();
    return newTaxi;
};

const createTaxiBooking = async (bookingData) => {
    const newBooking = new TaxiBooking(bookingData);
    await newBooking.save();
    return newBooking;
};

const changeTaxiBookingStatus = async (bookingId, status) => {
    try {
        const booking = await TaxiBooking.findById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }
        booking.bookingStatus = status;
        await booking.save();
        return booking;
    } catch (error) {
        throw new Error('Failed to change booking status: ' + error.message);
    }
};

const getTaxiBookingsByUserId = async (userId) => {
    try {
        const bookings = await TaxiBooking.find({ user: userId }).populate('taxi').populate('user');
        if (!bookings.length) {
            throw new Error('No bookings found for this user');
        }
        return bookings;
    } catch (error) {
        throw new Error('Failed to fetch bookings: ' + error.message);
    }
};

const getTaxiBookingsByTaxiId = async (taxiId) => {
    try {
        const bookings = await TaxiBooking.find({ taxi: taxiId }).populate('taxi').populate('user');
        if (!bookings.length) {
            throw new Error('No bookings found for this taxi');
        }
        return bookings;
    } catch (error) {
        throw new Error('Failed to fetch bookings: ' + error.message);
    }
};

const getTaxiByUserId = async (userId) => {
    try {
        const bookings = await Taxi.find({ owner: userId });
        if (!bookings.length) {
            throw new Error('No Taxis found for this user');
        }
        return bookings;
    } catch (error) {
        throw new Error('Failed to fetch Taxi: ' + error.message);
    }
};



module.exports = {
    getTaxis,
    getTaxiById,
    getTaxisByCity,
    createTaxi,
    createTaxiBooking,
    changeTaxiBookingStatus,
    getTaxiBookingsByUserId,
    getTaxiBookingsByTaxiId,
    getTaxiByUserId
    
};
