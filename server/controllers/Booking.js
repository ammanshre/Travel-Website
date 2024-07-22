const bookingService = require('../services/Booking');

const createBookingController = async (req, res) => {
    const { userId, transactionId, hotelId, rooms, totalAmount, isPaid, checkOutDate, checkInDate } = req.body;

    try {
        const bookingData = {
            userId,
            checkInDate,
            checkOutDate,
            transactionId,
            hotelId,
            rooms,
            totalAmount,
            isPaid,
        };

        const newBooking = await bookingService.createBooking(bookingData);

        res.status(201).json({
            message: 'Booking created successfully',
            booking: newBooking,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create booking',
            error: error.message,
        });
    }
};

const getBookingsByUserIdController = async (req, res) => {
    const { userId } = req.params;

    try {
        const bookings = await bookingService.getBookingsByUserId(userId);
        res.status(200).json({
            message: 'Bookings fetched successfully',
            bookings,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch bookings',
            error: error.message,
        });
    }
};

const getBookingsByHotelIdController = async (req, res) => {
    const { hotelId } = req.params;

    try {
        const bookings = await bookingService.getBookingsByHotelId(hotelId);
        res.status(200).json({
            message: 'Bookings fetched successfully',
            bookings,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch bookings',
            error: error.message,
        });
    }
};

const payHotelController = async (req, res) => {
    const { email, amount } = req.body;

    try {
        const checkoutUrl = await bookingService.payHotel(email, amount);

        res.status(200).json({
            message: 'Checkout session created successfully',
            checkoutUrl,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create checkout session',
            error: error.message,
        });
    }
};

const getAnalyticsController = async (req, res) => {
    try {
        const analytics = await bookingService.getAnalytics();
        res.status(200).json({
            message: 'Analytics fetched successfully',
            analytics,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch analytics',
            error: error.message,
        });
    }
};


module.exports = {
    createBookingController,
    getBookingsByUserIdController,
    getBookingsByHotelIdController,
    payHotelController,
    getAnalyticsController,
};
