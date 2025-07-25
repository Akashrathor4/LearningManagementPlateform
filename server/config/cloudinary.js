const cloudinary = require("cloudinary").v2;//cloudinary is being required

exports.cloudinaryConnect = () => {
    
    try{
             cloudinary.config({
                // configuration the cloudinary to upload media
                cloud_name : process.env.CLOUD_NAME,
                api_key : process.env.API_KEY,
                api_secret: process.env.API_SECRET,
             })
    }catch(error){
            return res.status(500).json({
                success:false,
                message:error.message,
            })
    }

}