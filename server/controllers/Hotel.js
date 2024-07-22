const { getCities, createHotel, getHotels, deleteHotel, getHotelsByUserId, getHotelById } = require('../services/Hotels');


const getCitiesController = async (req, res) => {
    try {
        const cities = await getCities();
        res.json(cities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createHotelController = async (req, res) => {
    try {
        const hotelData = req.body;
        const newHotel = await createHotel(hotelData);
        res.json(newHotel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getHotelsController = async (req, res) => {
    try {
        const hotels = await getHotels();
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteHotelController = async (req, res) => {
    try {
        const id = req.params.id;
        const hotel = await deleteHotel(id);
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getHotelByUserController = async (req, res) => {
    try {
        const user = req.params.userId;
        const hotels = await getHotelsByUserId(user);
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getHotelByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const hotel = await getHotelById(id);
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getCitiesController,
    createHotelController,
    getHotelsController,
    deleteHotelController,
    getHotelByUserController,
    getHotelByIdController
};


