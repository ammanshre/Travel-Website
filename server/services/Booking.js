const Booking = require('../models/Booking');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



const createBooking = async (bookingData) => {
    const { userId, transactionId, hotelId, rooms, totalAmount, isPaid, checkOutDate, checkInDate } = bookingData;

    try {
        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Fetch hotel details
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            throw new Error('Hotel not found');
        }

        // Validate rooms and quantities
        const roomDetails = await Promise.all(
            rooms.map(async (roomBooking) => {
                const room = await Room.findById(roomBooking.roomId);
                if (!room) {
                    throw new Error(`Room not found: ${roomBooking.roomId}`);
                }
                return {
                    room: roomBooking.roomId,
                    quantity: roomBooking.quantity,
                };
            })
        );

        const generateTransactionId = () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = 'TXN-';
            for (let i = 0; i < 12; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        };

        // Create new booking
        const newBooking = new Booking({
            transactionId: generateTransactionId(),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            checkInDate,
            checkOutDate,
            hotel: hotel._id,
            rooms: roomDetails,
            totalAmount,
            isPaid: true,
            dateOfTransaction: new Date(),
        });

        await newBooking.save();

        // Update totalRevenueGenerated for the hotel
        hotel.totalRevenueGenerated += totalAmount;
        await hotel.save();

        return newBooking;
    } catch (error) {
        throw new Error('Failed to create booking: ' + error.message);
    }
};

const getBookingsByUserId = async (userId) => {
    try {
        const bookings = await Booking.find({ 'user.id': userId }).populate('hotel').populate('rooms.room');
        if (!bookings.length) {
            throw new Error('No bookings found for this user');
        }
        return bookings;
    } catch (error) {
        throw new Error('Failed to fetch bookings: ' + error.message);
    }
};

const getBookingsByHotelId = async (hotelId) => {
    try {
        const bookings = await Booking.find({ hotel: hotelId }).populate('user.id').populate('hotel').populate('rooms.room');
        if (!bookings.length) {
            throw new Error('No bookings found for this hotel');
        }
        return bookings;
    } catch (error) {
        throw new Error('Failed to fetch bookings: ' + error.message);
    }
};
const MUR_TO_USD_CONVERSION_RATE = 0.023; 

const payHotel = async (email, amount) => {

    const amountInUSD = Math.round(amount * MUR_TO_USD_CONVERSION_RATE * 100); 



    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Booking Payment',
                        },
                         unit_amount: amountInUSD,
                    },
                    quantity: 1,
                },
            ],
            customer_email: email,
            mode: 'payment',
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
        });

        return session.url;
    } catch (error) {
        throw new Error('Failed to create checkout session: ' + error.message);
    }
};

const getAnalytics = async () => {
    try {
        // Total Listings
        const totalListings = await Hotel.countDocuments();

        // Total Transactions (Bookings)
        const totalTransactions = await Booking.countDocuments();

        // Total Revenue
        const totalRevenue = await Booking.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const totalRevenueAmount = totalRevenue[0] ? totalRevenue[0].total : 0;

        // Total Revenue for Current Month
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const totalRevenueCurrentMonth = await Booking.aggregate([
            { $match: { isPaid: true, dateOfTransaction: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const totalRevenueCurrentMonthAmount = totalRevenueCurrentMonth[0] ? totalRevenueCurrentMonth[0].total : 0;

        // Percentage increase or decrease in bookings
        const startOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
        const endOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
        
        const bookingsLastMonth = await Booking.countDocuments({
            dateOfTransaction: { $gte: startOfLastMonth, $lte: endOfLastMonth }
        });

        const bookingsCurrentMonth = await Booking.countDocuments({
            dateOfTransaction: { $gte: startOfMonth }
        });

        const bookingDifference = bookingsCurrentMonth - bookingsLastMonth;
        const percentageChange = bookingsLastMonth === 0
            ? bookingsCurrentMonth > 0 ? 100 : 0
            : (bookingDifference / bookingsLastMonth) * 100;

        return {
            totalListings,
            totalTransactions,
            totalRevenue: totalRevenueAmount,
            totalRevenueForCurrentMonth: totalRevenueCurrentMonthAmount,
            percentageChangeInBookings: percentageChange
        };
    } catch (error) {
        throw new Error('Failed to fetch analytics: ' + error.message);
    }
};


module.exports = {
    createBooking,
    getBookingsByUserId,
    getBookingsByHotelId,
    payHotel,
    getAnalytics

};
