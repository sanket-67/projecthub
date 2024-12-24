import asyncHandler from '../utilz/asyncHandler.js'
import ApiError from '../utilz/ApiError.js'
import { User } from '../models/User.js';
import {ApiResponse} from '../utilz/ApiResponse.js'
import { clouduploder } from '../utilz/cloudinary.js';
import { BannedEmail } from '../models/BannedUser.js';
const genrateAcessTokenandRefreshToken = async(userid)=>{
const user = await User.findById(userid)


const accesstoken = await  user.genrateAccessToken()
const refreshtoken = await  user.genrateRefreshToken()
user.refreshtoken = refreshtoken;
await user.save({ValidateBeforeSave : true})


return {refreshtoken,accesstoken}
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, password, email, fullname, skills } = req.body;

    if ([username, password, email, fullname].some(item => !item || item?.trim() === "")) {
        console.log("done for there");

        throw new ApiError(400, "All filelds are requried!!!")
    }
    if (!skills || skills.length == 0 ) {
        throw new ApiError(400, "All filelds are requried!!!") 
    }


const banneduser = await BannedEmail.findOne({email})


    if (banneduser) {
     throw new ApiError(401,"User is banned from website");
    }

    const existinguser = await User.findOne({
        $or: [{ username }, { email }]

    })
    console.log("getting here");
    if (existinguser) {
        throw new ApiError(400, "user already exist ");
    }
const useridpath = req.file.path
console.log(useridpath);

if (!useridpath) {
    console.log("we cannt get path of localfile ");
    throw new ApiError(400,"localpath is not found");
}
 const useridcard =await clouduploder(useridpath)


  const user = await User.create({

username, 
password, 
email, 
fullname,
useridcard : useridcard.url ,
skills

})
const userregister = await User.findById(user._id).select("-password -refreshtoken")


res.status(200).json( new ApiResponse(200,"User register Sucessfully",{userregister}))

})

const loginUser  = asyncHandler(async (req,res)=>{
const {username,password,email} = req.body;

if ([username,password].some(item=>!item|| item?.trim()==="")) {
    throw new ApiError(400,"All fileds are required");
}
 
console.log(username,password);

const user = await User.findOne({

    $or :[{username},{email}]
})

if (!user) {
    throw new ApiError(404,"user is not found please register first");
}

if (!user.isAllowed) {
    throw new ApiError(401,"user is not allowed right now");
}

const Correctpassword = await user.ispasswordCorrect(password)

if (!Correctpassword) {
    throw new ApiError(409 ,"THE PASSWORD IS INCORRECT CHECK THE PASSWORD");
}

 const {accesstoken,refreshtoken} = await genrateAcessTokenandRefreshToken(user._id)

const userloggedin = await User.findById(user._id).select("-password -refreshtoken")

const options={
httpOnly: true,
        secure: true, // for HTTPS
        sameSite: 'strict',

}
res.status(200).cookie("refreshtoken",refreshtoken,options)
.cookie("accesstoken",accesstoken,options)
.json(new ApiResponse(200,"User LOGINING SCCUESSFULLY",{userloggedin,"accesstoken " : accesstoken,"refreshtoken" : refreshtoken}))

})

const getpendingusers = asyncHandler(async (req,res)=>{
    
const users = await User.find({isAllowed:false})

if (users.length==0) {
    throw new ApiError(400,"something went wrong to fetch the pending request");
}

res.status(200).json(new ApiResponse(200,"Fetched pending request",{users}))
})

const grantUser = asyncHandler(async(req,res)=>{
    
const {username,email} = req.body;

if (!(username || email)) {
    throw new ApiError(400,"send any One filed username or password");
}

const user = await User.findOneAndUpdate({
    $or : [{username},{email}]
},{

isAllowed : true


},{
    new : true 
})

if (!user) {
    throw new ApiError(409,"There is prblem with user to find ");
}

res.status(200).json(new ApiResponse(200,"User is Approved ",{user}))


})

const bannedUser = asyncHandler(async(req,res)=>{

const {username,email} = req.body ;

if (!(username || email)) {
    throw new ApiError(400,"User is not found in banned route ");
}
await BannedEmail.create({email})
const user = await User.findOneAndDelete({
    $or :[{username},{email}]
})

res.status(200).json(new ApiResponse(200,"user remove from the db",user))

})

const logout = asyncHandler (async(req,res)=>{
const user = req.user;

if (!user) {
    throw new ApiError(401,"User is not there ");
}

const newuser = await User.findByIdAndUpdate({_id :user._id},{

    refreshtoken :null
},{
    new :true
})

const options = {
    httpOnly :true,
    Secure : true
}
res.status(200)
.clearCookie("accesstoken",options)
.clearCookie("refreshtoken",options)
.json(new ApiResponse(200,"User logout successfully"))



})

const changepassword = asyncHandler(async (req,res)=>{
const {oldpassword,newpassword,confirmpassword} = req.body;
const userfind = req.user;

if ([oldpassword,newpassword,confirmpassword].some(item => !item|| item?.trim()==="")) {
    throw new ApiError(401,"all fileds are required!!!");
}

const user = User.findById(userfind._id)

console.log(user);




})


export { registerUser , loginUser,getpendingusers,grantUser,bannedUser,logout,changepassword}
