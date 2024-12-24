import ApiError from "../utilz/ApiError.js";
import { ApiResponse } from "../utilz/ApiResponse.js";
import asyncHandler from "../utilz/asyncHandler.js";
import jwt from "jsonwebtoken"


const Adminverify = asyncHandler(async (req,res,next)=>{
console.log(req.cookies);

const token = req.cookies.accesstoken || req.header("Authorization")?.replace("Bearer ", "") 

console.log(token);
if (!token) {
    throw new ApiError(400,"token is not found in cookies and header");
}
const decoded = await jwt.verify(token,process.env.ACCESS_SECRET)

console.log(decoded);

if (decoded.userRole !=="admin") {
 throw new ApiError(401,"ACCESS DENIED TO USER TO THIS ROUTE ") 
}

console.log("admin is verified");


next()



})

export {Adminverify}
