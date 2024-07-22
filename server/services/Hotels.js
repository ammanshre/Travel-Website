const Hotel = require('../models/Hotel');
const City = require('../models/City');

const getCities = async () => {
    try {
        const cities = await City.find();
        return cities;
    } catch (error) {
        throw new Error('Failed to fetch cities: ' + error.message);
    }
};


const createHotel = async (hotelData) => {
    const newHotel = new Hotel(hotelData);
    await newHotel.save();
    return newHotel;
};

const getHotels = async () => {
    const hotels = await Hotel.find();
    return hotels;
};

const getHotelById = async (id) => {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
        throw new Error('Hotel not found');
    }
    return hotel;
};

const deleteHotel = async (id) => {
    try {
        const hotel = await Hotel.findById(id);
        if (!hotel) {
            throw new Error('Hotel not found');
        }
        await hotel.deleteOne();
        return { message: "Hotel successfully deleted" };
    } catch (error) {
        throw new Error('Failed to delete hotel: ' + error.message);
    }
};
const getHotelsByUserId = async (user) => {
    try {
        const hotels = await Hotel.find({ user });
        if (!hotels.length) {
            throw new Error('No hotels found for this user');
        }
        return hotels;
    } catch (error) {
        throw new Error('Failed to fetch hotels: ' + error.message);
    }
};



module.exports = {
    createHotel,
    getHotels,
    getHotelById,
    getCities,
    deleteHotel,
    getHotelsByUserId
};
