import asyncHandler from "../utilz/asyncHandler.js";
import jwt from "jsonwebtoken" 
import ApiError from '../utilz/ApiError.js'
import { User } from "../models/User.js";


const verifyJWT = asyncHandler(async(req,res,next)=>{
try {
    const  token = req.cookies.accesstoken || req.header('Authorization')?.replace("Bearer " , "")
if (!token) {
    throw new ApiError(400 ,"token is not found in cookies and header");
}
const decodedinfo = jwt.verify(token,process.env.ACCESS_SECRET)


const user = await User.findById(decodedinfo._id).select("-password")

req.user = user

next()

} catch (error) {
    throw new ApiError(500 ,"something went wrong in verfiyjwt");
next(error)
}







})

export {verifyJWT}