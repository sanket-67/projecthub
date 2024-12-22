> ### Cloudinary File Uploader
> This code configures Cloudinary and provides a function to upload files to Cloudinary.
>
> **Key Components:**
> - **dotenv**: Loads environment variables from a `.env` file.
> - **Cloudinary**: A cloud service that allows you to store and manage media files.
> - **fs**: Node.js file system module used for file handling.
>
> ```javascript
> import { v2 as cloudinary } from 'cloudinary'; // Import Cloudinary
> import fs from 'fs'; // Import file system module
> import dotenv from 'dotenv'; // Import dotenv for environment variables
>
> dotenv.config(); // Load environment variables from .env file
>
> cloudinary.config({ // Configure Cloudinary with credentials
>     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
>     api_key: process.env.CLOUDINARY_API_KEY,
>     api_secret: process.env.CLOUDINARY_API_SECRET,
> });
>
> const clouduploder = async (filePath) => { // Function to upload file
>     try {
>         if (!filePath) { // Check if file path is provided
>             return null; // Return null if no file path
>         }
>         const respose = await cloudinary.uploader.upload(filePath, { // Upload file
>             resource_type: 'auto' // Automatically determine resource type
>         });
>         console.log("File uploaded successfully:", respose.url); // Log success message
>         return respose; // Return upload response
>
>     } catch (error) { // Handle errors
>         console.log(error); // Log error
>         fs.unlinkSync(filePath); // Delete the file from local storage
>         return null; // Return null in case of error
>     }   
> }
> 
> export { clouduploder }; // Export the uploader function for use in other modules
> ```


> ### Short Notes on `clouduploder` Function
> 
> - **Purpose**: The `clouduploder` function is designed to upload a file to Cloudinary.
> 
> - **Parameters**:
>   - `filePath`: A string representing the local file path of the file to be uploaded.
> 
> - **Return Value**: 
>   - Returns the response from Cloudinary if the upload is successful.
>   - Returns `null` if the `filePath` is not provided or if an error occurs during the upload process.
> 
> - **Error Handling**: 
>   - If an error occurs, the function logs the error message to the console.
>   - The function deletes the local file using `fs.unlinkSync()` to free up space.
> 
> - **Resource Type**: 
>   - The `resource_type` is set to `'auto'`, allowing Cloudinary to automatically determine the type of the uploaded file (e.g., image, video).
> 
> - **Logging**: 
>   - On successful upload, it logs the URL of the uploaded file to the console, providing quick access to the uploaded file.
