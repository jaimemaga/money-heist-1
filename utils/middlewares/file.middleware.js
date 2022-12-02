const multer = require('multer');
const path = require('path');

const VALID_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
    if (!VALID_FILE_TYPES.includes(file.mimetype)) {
        cb(new Error('Invalid file type'));
    } else {
        cb(null, true);
    }
};

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
    destination: (req, file, cb) => {
        console.log(__dirname, path.join(process.cwd(), '/files'))
        cb(null, path.join(process.cwd(), '/files'));
    }
});

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;