const multer = require('multer');

// Set up multer memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return cb(new Error('Only .jpg, .jpeg, .png formats allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 3 * 1024 * 1024 
    }
});

module.exports = upload;
