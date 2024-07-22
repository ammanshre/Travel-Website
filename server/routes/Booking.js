const express = require('express');
const router = express.Router();
const { createBookingController, getBookingsByUserIdController, getBookingsByHotelIdController, payHotelController, getAnalyticsController } = require('../controllers/Booking');

/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Booking related endpoints
 */

/**
 * @swagger
 * /api/booking/create:
 *   post:
 *     tags: [Booking]
 *     summary: Create a new booking
 *     description: Creates a new booking with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user making the booking
 *                 example: 60d0fe4f5311236168a109ca
 *               transactionId:
 *                 type: string
 *                 description: Unique transaction ID
 *                 example: TXN-1234567890
 *               hotelId:
 *                 type: string
 *                 description: ID of the hotel being booked
 *                 example: 60d0fe4f5311236168a109cb
 *               rooms:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     roomId:
 *                       type: string
 *                       description: ID of the room being booked
 *                       example: 60d0fe4f5311236168a109cc
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the room being booked
 *                       example: 2
 *               totalAmount:
 *                 type: number
 *                 description: Total amount for the booking
 *                 example: 300
 *               isPaid:
 *                 type: boolean
 *                 description: Payment status
 *                 example: true
 *               checkInDate:
 *                 type: string
 *                 format: date
 *                 description: Check-in date for the booking
 *                 example: 2023-12-01
 *               checkOutDate:
 *                 type: string
 *                 format: date
 *                 description: Check-out date for the booking
 *                 example: 2023-12-10
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking created successfully
 *                 booking:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Bad request, such as missing required fields
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/booking/user/{userId}:
 *   get:
 *     tags: [Booking]
 *     summary: Retrieve bookings by user ID
 *     description: Fetches all bookings made by a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: A list of bookings made by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Bad request, such as invalid user ID
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/booking/hotel/{hotelId}:
 *   get:
 *     tags: [Booking]
 *     summary: Retrieve bookings by hotel ID
 *     description: Fetches all bookings for a specific hotel.
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the hotel
 *     responses:
 *       200:
 *         description: A list of bookings for the hotel.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Bad request, such as invalid hotel ID
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/booking/payhotel:
 *   post:
 *     tags: [Booking]
 *     summary: Create a Stripe checkout session
 *     description: Creates a new Stripe checkout session for hotel booking payment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the customer
 *                 example: customer@example.com
 *               amount:
 *                 type: number
 *                 description: Total amount for the payment
 *                 example: 300
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Checkout session created successfully
 *                 checkoutUrl:
 *                   type: string
 *                   example: https://checkout.stripe.com/pay/cs_test_1234567890
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/booking/analytics:
 *   get:
 *     tags: [Booking]
 *     summary: Get booking analytics
 *     description: Fetches booking analytics including total listings, total transactions, total revenue, total revenue for the current month, and the percentage increase or decrease in bookings.
 *     responses:
 *       200:
 *         description: Analytics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Analytics fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalListings:
 *                       type: number
 *                       example: 100
 *                     totalTransactions:
 *                       type: number
 *                       example: 200
 *                     totalRevenue:
 *                       type: number
 *                       example: 50000
 *                     totalRevenueForCurrentMonth:
 *                       type: number
 *                       example: 10000
 *                     percentageChangeInBookings:
 *                       type: number
 *                       example: 15
 *       500:
 *         description: Internal server error
 */

router.post('/payhotel', payHotelController);
router.post('/create', createBookingController);
router.get('/user/:userId', getBookingsByUserIdController);
router.get('/hotel/:hotelId', getBookingsByHotelIdController);
router.get('/analytics', getAnalyticsController);

module.exports = router;
