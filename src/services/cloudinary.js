const cloudinary = require('cloudinary').v2; // Use v2 for the latest version

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET
});

const uploadToCloudinary = (path, folder) => {
    return cloudinary.uploader.upload(path, {
        folder: folder
    })
    .then((data) => {
        return { url: data.url, public_id: data.public_id };
    })
    .catch((error) => {
        console.error(error);
        throw error; // Rethrow the error to handle it at a higher level if needed
    });
};

const removeFromCloudinary = async (public_id) => {
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        console.log(result);
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error to handle it at a higher level if needed
    }
};

module.exports = { uploadToCloudinary, removeFromCloudinary };
