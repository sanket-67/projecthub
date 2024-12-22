# Multer DiskStorage Setup with ES6 Import

## Step-by-Step Guide

> ### 1. **Install Multer**
> First, you need to install Multer in your Node.js > project.
>```javascript
> npm i multer 
> ```
> In your JavaScript file, import the Multer library > using the ES6 import syntax.

> ### 2. Import Multer
> In your JavaScript file, import the Multer library using the ES6 import syntax.
> 
> ```javascript
> import multer from "multer";
> ```

> ### 3. Configure DiskStorage
> You need to configure Multer's `diskStorage` method to define the `destination` and `filename` for the uploaded files.
> 
> The `diskStorage` function accepts an `object` with two functions:
> - **destination**: Specifies where the uploaded files will be saved.
> - **filename**: Defines the name the file will be saved as.
>
> ```javascript
> const storage = multer.diskStorage({
>   destination: function (req, file, cb) {
>     // Setting the directory to store the uploaded files
>     cb(null, './public');  // 'public' is the folder where files will be stored
>   },
>   filename: function (req, file, cb) {
>     // Saving the file with its original name
>     cb(null, file.originalname);  // 'originalname' is the name of the file being uploaded
>   }
> });
> ```

> ### 4. Create the Upload Function
>> ### 4. Create the Upload Function
> Now, use the multer <span style="color: blue;">function</span> and pass the storage configuration to it. This will create an <span style="color: green;">upload middleware</span> for handling `<span style="color: orange;">file uploads</span>.
> 
> 
> ```javascript
> export const upload = multer({ storage });
> ```

> ### 5. Explanation of Functions in DiskStorage
> - **destination**: This function determines the folder where the files will be saved. The `cb` (callback) function is called with `null` for error handling, followed by the folder path.
>
> ```javascript
> destination: function (req, file, cb) {
>   cb(null, './public');  // Path where the files will be saved
> }
> ```
>
> - **filename**: This function sets the file name. It takes the original file name from the uploaded file (`file.originalname`), and the `cb` callback is used to store the file with that name.
>
> ```javascript
> filename: function (req, file, cb) {
>   cb(null, file.originalname);  // File will be saved with its original name
> }
> ```

> ### 6. Exporting the upload Function
> Export the `upload` function so it can be used in your routes to handle file uploads.
> 
> ```javascript
> export const upload = multer({ storage });
> ```
