// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/Auth');
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Can register a new user with a username, password, and role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [buyer, seller, admin]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Error message
 */

router.post('/signup', authController.registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     description: Log in with username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid username or password
 */
router.post('/login', authController.loginUser);

module.exports = router;
