const express = require('express');
const router = express.Router();
const {
    getTaxisController,
    getTaxiByIdController,
    getTaxisByCityController,
    createTaxiController,
    createTaxiBookingController,
    changeTaxiBookingStatusController,
    getTaxiBookingsByUserIdController,
    getTaxiBookingsByTaxiIdController,
    getTaxiByUserIdController,
} = require('../controllers/Taxi');

/**
 * @swagger
 * tags:
 *   name: Taxi
 *   description: Taxi related endpoints
 */

/**
 * @swagger
 * /api/taxi/create:
 *   post:
 *     summary: Create a new taxi
 *     tags: [Taxi]
 *     description: Creates a new taxi with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - make
 *               - model
 *               - year
 *               - licensePlate
 *               - color
 *               - capacity
 *               - ratePerKm
 *               - location
 *               - city
 *               - owner
 *             properties:
 *               make:
 *                 type: string
 *                 description: Make of the taxi.
 *               model:
 *                 type: string
 *                 description: Model of the taxi.
 *               year:
 *                 type: number
 *                 description: Year of manufacture of the taxi.
 *               licensePlate:
 *                 type: string
 *                 description: License plate of the taxi.
 *               color:
 *                 type: string
 *                 description: Color of the taxi.
 *               capacity:
 *                 type: number
 *                 description: Capacity of the taxi.
 *               ratePerKm:
 *                 type: number
 *                 description: Rate per kilometer.
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     description: Type of the location.
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     description: Coordinates of the location [longitude, latitude].
 *               city:
 *                 type: string
 *                 description: The MongoDB ObjectId for the city document associated with this taxi.
 *               owner:
 *                 type: string
 *                 description: The MongoDB ObjectId for the user who owns this taxi.
 *     responses:
 *       201:
 *         description: Taxi created successfully. Returns the newly created taxi data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Taxi'
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Server error.
 */

// POST: Create a new taxi
router.post('/create', createTaxiController);

/**
 * @swagger
 * /api/taxi/get:
 *   get:
 *     summary: Retrieve all taxis
 *     tags: [Taxi]
 *     description: Fetches a list of all taxis available in the database.
 *     responses:
 *       200:
 *         description: A list of taxis.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Taxi'
 *       500:
 *         description: Internal server error
 * components:
 *   schemas:
 *     Taxi:
 *       type: object
 *       required:
 *         - make
 *         - model
 *         - year
 *         - licensePlate
 *         - color
 *         - capacity
 *         - ratePerKm
 *         - location
 *         - city
 *         - owner
 *       properties:
 *         make:
 *           type: string
 *           description: Make of the taxi.
 *         model:
 *           type: string
 *           description: Model of the taxi.
 *         year:
 *           type: number
 *           description: Year of manufacture of the taxi.
 *         licensePlate:
 *           type: string
 *           description: License plate of the taxi.
 *         color:
 *           type: string
 *           description: Color of the taxi.
 *         capacity:
 *           type: number
 *           description: Capacity of the taxi.
 *         ratePerKm:
 *           type: number
 *           description: Rate per kilometer.
 *         location:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               description: Type of the location.
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               description: Coordinates of the location [longitude, latitude].
 *         city:
 *           type: string
 *           description: The MongoDB ObjectId for the city document associated with this taxi.
 *         owner:
 *           type: string
 *           description: The MongoDB ObjectId for the user who owns this taxi.
 */

// GET : Get all taxis
router.get('/get', getTaxisController);

/**
 * @swagger
 * /api/taxi/{id}:
 *   get:
 *     summary: Retrieve a taxi by ID
 *     tags: [Taxi]
 *     description: Fetches a taxi by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the taxi to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A taxi object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Taxi'
 *       404:
 *         description: Taxi not found.
 *       500:
 *         description: Internal server error.
 */
// GET: Get a taxi by ID
router.get('/:id', getTaxiByIdController);

/**
 * @swagger
 * /api/taxi/city/{cityId}:
 *   get:
 *     summary: Retrieve taxis by city ID
 *     tags: [Taxi]
 *     description: Fetches a list of taxis associated with a specific city.
 *     parameters:
 *       - in: path
 *         name: cityId
 *         required: true
 *         description: MongoDB ObjectId of the city whose taxis to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of taxis associated with the city.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Taxi'
 *       404:
 *         description: No taxis found for the city.
 *       500:
 *         description: Internal server error.
 */
// GET: Get taxis by city ID
router.get('/city/:cityId', getTaxisByCityController);

/**
 * @swagger
 * /api/taxi/booking/create:
 *   post:
 *     summary: Create a new taxi booking
 *     tags: [Taxi]
 *     description: Creates a new taxi booking with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - taxi
 *               - pickupLocation
 *               - dropoffLocation
 *               - fare
 *               - distance
 *             properties:
 *               user:
 *                 type: string
 *                 description: The MongoDB ObjectId for the user who is booking the taxi.
 *               taxi:
 *                 type: string
 *                 description: The MongoDB ObjectId for the taxi being booked.
 *               pickupLocation:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     description: Type of the location.
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     description: Coordinates of the location [longitude, latitude].
 *                   address:
 *                     type: string
 *                     description: Address of the pickup location.
 *               dropoffLocation:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     description: Type of the location.
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     description: Coordinates of the location [longitude, latitude].
 *                   address:
 *                     type: string
 *                     description: Address of the dropoff location.
 *               fare:
 *                 type: number
 *                 description: Fare for the ride.
 *               distance:
 *                 type: number
 *                 description: Distance of the ride.
 *               bookingStatus:
 *                 type: string
 *                 enum: ['pending', 'confirmed', 'completed', 'cancelled']
 *                 description: Status of the booking.
 *     responses:
 *       201:
 *         description: Taxi booking created successfully. Returns the newly created taxi booking data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaxiBooking'
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Server error.
 * components:
 *   schemas:
 *     TaxiBooking:
 *       type: object
 *       required:
 *         - user
 *         - taxi
 *         - pickupLocation
 *         - dropoffLocation
 *         - fare
 *         - distance
 *       properties:
 *         user:
 *           type: string
 *           description: The MongoDB ObjectId for the user who is booking the taxi.
 *         taxi:
 *           type: string
 *           description: The MongoDB ObjectId for the taxi being booked.
 *         pickupLocation:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               description: Type of the location.
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               description: Coordinates of the location [longitude, latitude].
 *             address:
 *               type: string
 *               description: Address of the pickup location.
 *         dropoffLocation:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               description: Type of the location.
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               description: Coordinates of the location [longitude, latitude].
 *             address:
 *               type: string
 *               description: Address of the dropoff location.
 *         fare:
 *           type: number
 *           description: Fare for the ride.
 *         distance:
 *           type: number
 *           description: Distance of the ride.
 *         bookingStatus:
 *           type: string
 *           enum: ['pending', 'confirmed', 'completed', 'cancelled']
 *           description: Status of the booking.
 */

// POST: Create a new taxi booking
router.post('/booking/create', createTaxiBookingController);

/**
 * @swagger
 * /api/taxi/booking/status/{id}:
 *   patch:
 *     summary: Change taxi booking status
 *     tags: [Taxi]
 *     description: Changes the status of an existing taxi booking.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the booking to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['pending', 'confirmed', 'completed', 'cancelled']
 *                 description: New status of the booking.
 *     responses:
 *       200:
 *         description: Booking status updated successfully. Returns the updated booking data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaxiBooking'
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: Booking not found.
 *       500:
 *         description: Server error.
 */

// PATCH: Change taxi booking status
router.patch('/booking/status/:id', changeTaxiBookingStatusController);

/**
 * @swagger
 * /api/taxi/bookings/user/{userId}:
 *   get:
 *     summary: Retrieve taxi bookings by user ID
 *     tags: [Taxi]
 *     description: Fetches a list of taxi bookings associated with a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: MongoDB ObjectId of the user whose bookings to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of taxi bookings associated with the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TaxiBooking'
 *       404:
 *         description: No bookings found for the user.
 *       500:
 *         description: Internal server error.
 */

// GET: Get taxi bookings by user ID
router.get('/bookings/user/:userId', getTaxiBookingsByUserIdController);

/**
 * @swagger
 * /api/taxi/bookings/taxi/{taxiId}:
 *   get:
 *     summary: Retrieve taxi bookings by taxi ID
 *     tags: [Taxi]
 *     description: Fetches a list of taxi bookings associated with a specific taxi.
 *     parameters:
 *       - in: path
 *         name: taxiId
 *         required: true
 *         description: MongoDB ObjectId of the taxi whose bookings to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of taxi bookings associated with the taxi.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TaxiBooking'
 *       404:
 *         description: No bookings found for the taxi.
 *       500:
 *         description: Internal server error.
 */

// GET: Get taxi bookings by taxi ID
router.get('/bookings/taxi/:taxiId', getTaxiBookingsByTaxiIdController);



/**
 * @swagger
 * /api/taxi/listings/taxi/{userId}:
 *   get:
 *     summary: Retrieve taxis by User ID
 *     tags: [Taxi]
 *     description: Fetches a list of taxi bookings associated with a specific taxi.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: MongoDB ObjectId of the taxi whose bookings to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of taxi associated with the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Taxi'
 *       404:
 *         description: No Taxis found for the user.
 *       500:
 *         description: Internal server error.
 */

// GET: Get taxi by userId ID
router.get('/listings/taxi/:userId', getTaxiByUserIdController);



module.exports = router;
