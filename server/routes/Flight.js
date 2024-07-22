// routes/flight.js
const express = require('express');
const router = express.Router();
const { autocompleteController, getAirportsController, getFlightsController, getFlightOfferPricingController, bookFlightController, payFlightController, getFlightBookingsByUserIdController } = require('../controllers/Flight');
const {chatController} = require('../controllers/Ai');
/**
 * @swagger
 * tags:
 *   name: Flight
 *   description: Flight related endpoints
 */



/**
 * @swagger
 * /api/flight/autocomplete:
 *   get:
 *     tags: [Flight]
 *     summary: Autocomplete for location suggestions
 *     description: Provides location suggestions based on a user's input keyword. Useful for auto-completing city names, airport codes, etc.
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         description: Partial input for which location suggestions are sought.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An array of suggested locations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: string
 *                     description: The suggested location value.
 *                   label:
 *                     type: string
 *                     description: A readable label for the suggested location.
 *       400:
 *         description: Bad request, such as missing keyword query parameter.
 *       500:
 *         description: Internal server error
 */


router.get('/autocomplete', autocompleteController);




/**
 * @swagger
 * /api/flight/airports:
 *   get:
 *     tags:
 *       - Flight
 *     summary: Get airports information
 *     description: Provides information on airports based on a user's input keyword.
 *     operationId: getAirports
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         type: string
 *         description: The user's input keyword to search for airports.
 *     responses:
 *       200:
 *         description: An array of airports information.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/AirportInfo'
 *       400:
 *         description: Bad Request. Keyword query parameter is required.
 *       500:
 *         description: Internal Server Error
 * definitions:
 *   AirportInfo:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         description: Name of the airport.
 *       iataCode:
 *         type: string
 *         description: The IATA code of the airport.
 *       city:
 *         type: string
 *         description: The city where the airport is located.
 */

router.get('/airports', getAirportsController);


/**
 * @swagger
 * /api/flight/flights:
 *   get:
 *     tags:
 *       - Flight
 *     summary: Search for flight offers
 *     description: Fetches flight offers based on search criteria like origin, destination, departure date, and number of adults.
 *     operationId: getFlights
 *     parameters:
 *       - in: query
 *         name: originLocationCode
 *         required: true
 *         type: string
 *         description: The IATA code for the origin location.
 *       - in: query
 *         name: destinationLocationCode
 *         required: true
 *         type: string
 *         description: The IATA code for the destination location.
 *       - in: query
 *         name: departureDate
 *         required: true
 *         type: string
 *         format: date
 *         description: The departure date in YYYY-MM-DD format.
 *       - in: query
 *         name: adults
 *         required: true
 *         type: integer
 *         description: The number of adult passengers.
 *       - in: query
 *         name: returnDate
 *         required: false
 *         type: string
 *         format: date
 *         description: The return date in YYYY-MM-DD format (optional).
 *     responses:
 *       200:
 *         description: An array of flight offers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/FlightOffer'
 *       400:
 *         description: Bad Request, such as missing required query parameters.
 *       500:
 *         description: Internal Server Error
 * definitions:
 *   FlightOffer:
 *     type: object
 *     properties:
 *       price:
 *         type: object
 *         description: Price details of the flight offer.
 *       itineraries:
 *         type: array
 *         items:
 *           type: object
 *           description: Itinerary details of the flight offer.
 */

router.get('/flights', getFlightsController);



/**
 * @swagger
 * /api/flight/pricing:
 *   post:
 *     tags:
 *       - Flight
 *     summary: Get pricing for flight offers
 *     description: Retrieves pricing details for specified flight offers.
 *     operationId: getFlightOffersPricing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flightOffers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   description: Flight offer to retrieve pricing for.
 *                 description: Array of flight offers for which pricing information is requested.
 *     responses:
 *       200:
 *         description: Pricing details for the flight offers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     flightOffers:
 *                       type: array
 *                       items:
 *                         $ref: '#/definitions/FlightOffer'
 *                     dictionaries:
 *                       type: object
 *                       description: Additional dictionaries to interpret the response data.
 *       400:
 *         description: Bad Request, such as missing flight offers in the request body.
 *       500:
 *         description: Internal Server Error
 */

router.post('/pricing', getFlightOfferPricingController);


/**
 * @swagger
 * /api/flight/book:
 *   post:
 *     tags:
 *       - Flight
 *     summary: Confirm and book a flight
 *     description: This endpoint is used to confirm and book a flight based on the provided flight offer, traveler information, contact details, and user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - flightOffer
 *               - travelerInfo
 *               - contacts
 *               - userId
 *             properties:
 *               flightOffer:
 *                 type: object
 *                 description: The flight offer to be booked.
 *               travelerInfo:
 *                 type: array
 *                 items:
 *                   type: object
 *                 description: An array of traveler information.
 *               contacts:
 *                 type: array
 *                 items:
 *                   type: object
 *                 description: An array of contact details for the booking.
 *               userId:
 *                 type: string
 *                 description: The ID of the user making the booking.
 *     responses:
 *       200:
 *         description: Flight booking confirmed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Flight booking confirmed
 *                 bookingDetails:
 *                   type: object
 *                   description: The details of the confirmed booking.
 *       400:
 *         description: Invalid input, such as missing required booking details.
 *       500:
 *         description: Error processing the flight booking.
 */

router.post('/book', bookFlightController);

/**
 * @swagger
 * /api/flight/pay:
 *   post:
 *     tags:
 *       - Flight
 *     summary: Process flight payment
 *     description: Creates a payment session for flight booking.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - amountInMUR
 *             properties:
 *               email:
 *                 type: string
 *                 description: Customer's email address.
 *               amountInMUR:
 *                 type: number
 *                 description: Amount to be paid in Mauritian Rupees.
 *     responses:
 *       200:
 *         description: URL for the payment session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL for the payment session.
 *       400:
 *         description: Bad Request, such as missing required fields.
 *       500:
 *         description: Internal Server Error
 */

router.post('/pay', payFlightController);



/**
 * @swagger
 * /api/flight/bookings/user/{userId}:
 *   get:
 *     tags: [Flight]
 *     summary: Get flight bookings by user ID
 *     description: Retrieves flight bookings associated with a specific user ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user whose bookings are to be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An array of flight bookings for the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   transactionId:
 *                     type: string
 *                     description: The transaction ID of the booking.
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The user ID.
 *                       name:
 *                         type: string
 *                         description: The name of the user.
 *                       email:
 *                         type: string
 *                         description: The email of the user.
 *                   itineraries:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         segments:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               departure:
 *                                 type: object
 *                                 properties:
 *                                   iataCode:
 *                                     type: string
 *                                   countryName:
 *                                     type: string
 *                                   at:
 *                                     type: string
 *                                     format: date-time
 *                               arrival:
 *                                 type: object
 *                                 properties:
 *                                   iataCode:
 *                                     type: string
 *                                   countryName:
 *                                     type: string
 *                                   at:
 *                                     type: string
 *                                     format: date-time
 *                               carrierCode:
 *                                 type: string
 *                               airlineLogo:
 *                                 type: string
 *                               duration:
 *                                 type: string
 *                               numberOfStops:
 *                                 type: integer
 *                               aircraft:
 *                                 type: object
 *                                 properties:
 *                                   code:
 *                                     type: string
 *                                   name:
 *                                     type: string
 *                   price:
 *                     type: object
 *                     properties:
 *                       currency:
 *                         type: string
 *                       total:
 *                         type: number
 *                       base:
 *                         type: number
 *                   isPaid:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Invalid user ID parameter.
 *       500:
 *         description: Error fetching bookings.
 */

router.get('/bookings/user/:userId', getFlightBookingsByUserIdController);


/**
 * @swagger
 * /api/flight/chat:
 *   post:
 *     tags: [Flight]
 *     summary: Chat with the AI vacation planner
 *     description: Interact with the AI to get vacation planning assistance and book flights. The AI will help with suggestions and booking flights based on user input.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The user's message or query for the AI.
 *     responses:
 *       200:
 *         description: The AI's response to the user's message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   description: The AI's response message.
 *       400:
 *         description: Bad request, such as missing required fields in the request body.
 *       500:
 *         description: Internal server error
 */
router.post('/chat', chatController);

module.exports = router;





module.exports = router;