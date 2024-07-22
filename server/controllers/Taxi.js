const {
    getTaxis,
    getTaxiById,
    getTaxisByCity,
    createTaxi,
    createTaxiBooking,
    changeTaxiBookingStatus,
    getTaxiBookingsByUserId,
    getTaxiBookingsByTaxiId,
    getTaxiByUserId,
} = require('../services/Taxi');

const getTaxisController = async (req, res) => {
    try {
        const taxis = await getTaxis();
        res.json(taxis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTaxiByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const taxi = await getTaxiById(id);
        res.json(taxi);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTaxisByCityController = async (req, res) => {
    try {
        const cityId = req.params.cityId;
        const taxis = await getTaxisByCity(cityId);
        res.json(taxis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createTaxiController = async (req, res) => {
    try {
        const taxiData = req.body;
        const newTaxi = await createTaxi(taxiData);
        res.json(newTaxi);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createTaxiBookingController = async (req, res) => {
    try {
        const bookingData = req.body;
        const newBooking = await createTaxiBooking(bookingData);
        res.json(newBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const changeTaxiBookingStatusController = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { status } = req.body;
        const updatedBooking = await changeTaxiBookingStatus(bookingId, status);
        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTaxiBookingsByUserIdController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookings = await getTaxiBookingsByUserId(userId);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTaxiBookingsByTaxiIdController = async (req, res) => {
    try {
        const taxiId = req.params.taxiId;
        const bookings = await getTaxiBookingsByTaxiId(taxiId);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTaxiByUserIdController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const taxi = await getTaxiByUserId(userId);
        res.json(taxi);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    getTaxisController,
    getTaxiByIdController,
    getTaxisByCityController,
    createTaxiController,
    createTaxiBookingController,
    changeTaxiBookingStatusController,
    getTaxiBookingsByUserIdController,
    getTaxiBookingsByTaxiIdController,
    getTaxiByUserIdController,
};
