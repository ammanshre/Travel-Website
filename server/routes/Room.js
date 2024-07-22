
const express = require('express');
const router = express.Router();
const { createRoomController, getRoomsController } = require('../controllers/Room');

/**
 * @swagger
 * /api/room/create:
 *   post:
 *     summary: Create a new room in a hotel
 *     tags: [Room]
 *     description: Creates a new room and updates the hotel's cheapest room price if applicable.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - hotelId
 *               - type
 *               - price
 *               - quantity
 *               - amenities
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the room.
 *               hotelId:
 *                 type: string
 *                 description: The MongoDB ObjectId for the hotel.
 *               type:
 *                 type: string
 *                 enum: ['single', 'double', 'suite', 'deluxe', 'presidential']
 *                 description: Type of the room.
 *               price:
 *                 type: number
 *                 description: Price per night for the room.
 *               quantity:
 *                 type: number
 *                 description: Number of such rooms available.
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Amenities provided in the room.
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: URLs of images of the room.
 *               description:
 *                 type: string
 *                 description: Detailed description of the room.
 *     responses:
 *       201:
 *         description: Room created successfully. Returns the newly created room data.
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Internal server error.
 */

// POST: Create a new room
router.post('/create', createRoomController);




/**
 * @swagger
 * /api/room/get/{hotelId}:
 *   get:
 *     summary: Retrieve all rooms for a specific hotel
 *     tags: [Room]
 *     description: Fetches a list of all rooms associated with a given hotel ID.
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         description: The MongoDB ObjectId of the hotel to fetch rooms for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of rooms retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       400:
 *         description: Invalid hotel ID.
 *       404:
 *         description: No rooms found for the given hotel ID.
 *       500:
 *         description: Internal server error.
 */



// GET: Get all rooms for a hotel
router.get('/get/:hotelId', getRoomsController);

module.exports = router;
