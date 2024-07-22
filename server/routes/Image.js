const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const { uploadImageToCloudinary } = require('../services/Image');

/**
 * @swagger
 * tags:
 *   name: Image
 *   description: Upload Image related endpoints
 */



/**
 * @swagger
 * /api/image/upload:
 *   post:
 *     summary: Upload an image
 *     tags: [Image]
 *     description: Uploads an image to Cloudinary and returns the URL of the uploaded image.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload.
 *     responses:
 *       200:
 *         description: The image URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   example: http://res.cloudinary.com/example/image/upload/v1581345674/sample.jpg
 *       400:
 *         description: Bad request, such as no file uploaded
 *       500:
 *         description: Server error
 */

router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    
    try {
        const imageUrl = await uploadImageToCloudinary(req.file.buffer);
        res.status(200).json({ imageUrl: imageUrl });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Error uploading image' });
    }
});

module.exports = router;