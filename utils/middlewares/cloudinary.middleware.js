const cloudinary = require('cloudinary');
const fs = require('fs');

const uploadToCloudinary = async (req, res, next) => {
    if (req.file) {
        try {
            const path = req.file.path;
            console.log(req.file.path);
            const image = await cloudinary.uploader.upload(path);

            await fs.unlinkSync(path);

            req.file_url = image.secure_url;
            return next();
        } catch (err) {
            console.log('HEY')
            return next(err);
        }   
    } else {
        return next();
    }
};

module.exports = uploadToCloudinary;