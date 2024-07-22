const express = require('express');
const router = express.Router();
const { getCitiesController } = require('../controllers/Hotel');

/**
 * @swagger
 * tags:
 *   name: City
 *   description: City related endpoints
 */

/**
 * @swagger
 * /api/city/get:
 *   get:
 *     tags: [City]
 *     summary: Retrieve all cities
 *     description: Fetches a list of all cities in the database.
 *     responses:
 *       200:
 *         description: A list of cities.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: Name of the city
 *                   lat:
 *                     type: string
 *                     description: Latitude of the city
 *                   lng:
 *                     type: string
 *                     description: Longitude of the city
 *                   country:
 *                     type: string
 *                     description: Country where the city is located
 *                   iso2:
 *                     type: string
 *                     description: ISO2 country code
 *                   admin_name:
 *                     type: string
 *                     description: Administrative division name (state, province, etc.)
 *                   capital:
 *                     type: string
 *                     description: Type of capital (e.g., administrative, primary)
 *                   population:
 *                     type: integer
 *                     description: Population count
 *                   population_proper:
 *                     type: integer
 *                     description: Proper population count within city limits
 *       400:
 *         description: Bad request, such as invalid query parameters.
 *       500:
 *         description: Internal server error
 */

router.get('/get', getCitiesController);

module.exports = router;
