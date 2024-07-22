const cloudinary = require('cloudinary').v2;

// Load environment variables
const dotenv = require('dotenv');
dotenv.config();


const cloudname = process.env.CLOUDINARY_CLOUD_NAME;
const apikey = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudname,
  api_key: apikey,
  api_secret: api_secret,
});

const uploadImageToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'hotels' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url); 
        }
      }
    );
    uploadStream.end(buffer);
  });
};

module.exports = { uploadImageToCloudinary };
