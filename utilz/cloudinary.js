import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });


const clouduploder = async (filePath) => {
    try {
        if (!filePath) {
            return null
        }
        const respose = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto'
        })
        console.log("file upload sucessfully", respose.url);
        return respose

    } catch (error) {
        console.log(error);
        fs.unlinkSync(filePath)
        return null

    }   

}
export { clouduploder }