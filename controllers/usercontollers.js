import asyncHandler from '../utilz/asyncHandler.js'
import ApiError from '../utilz/ApiError.js'
import { User } from '../models/User.js'
import { ApiResponse } from '../utilz/ApiResponse.js'
import { clouduploder } from '../utilz/cloudinary.js'
import { BannedEmail } from '../models/BannedUser.js'

const genrateAcessTokenandRefreshToken = async(userid) => {
    const user = await User.findById(userid)
    const accesstoken = await user.genrateAccessToken()
    const refreshtoken = await user.genrateRefreshToken()
    user.refreshtoken = refreshtoken
    await user.save({ ValidateBeforeSave: true })
    return { refreshtoken, accesstoken }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, password, email, fullname, skills } = req.body

    if ([username, password, email, fullname].some(item => !item || item?.trim() === "")) {
        throw new ApiError(400, "All fields are required!")
    }
    if (!skills || skills.length === 0) {
        throw new ApiError(400, "Skills are required!")
    }

    const banneduser = await BannedEmail.findOne({ email })
    if (banneduser) {
        throw new ApiError(401, "User is banned from website")
    }

    const existinguser = await User.findOne({
        $or: [{ username }, { email }]
    })
    
    if (existinguser) {
        throw new ApiError(400, "User already exists")
    }

    const useridpath = req.file?.path
    if (!useridpath) {
        throw new ApiError(400, "ID card image is required")
    }

    const useridcard = await clouduploder(useridpath)
    const user = await User.create({
        username,
        password,
        email,
        fullname,
        useridcard: useridcard.url,
        skills
    })

    const userregister = await User.findById(user._id).select("-password -refreshtoken")
    res.status(201).json(new ApiResponse(201, "User registered successfully", { userregister }))
})

const loginUser = asyncHandler(async (req, res) => {
    const { identifier, password, email } = req.body

    if ([identifier, password].some(item => !item || item?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

     const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
        throw new ApiError(404, "User not found. Please register first")
    }

    if (!user.isAllowed) {
        throw new ApiError(401, "User is not allowed at this time")
    }

    const isCorrectPassword = await user.ispasswordCorrect(password)
    if (!isCorrectPassword) {
        throw new ApiError(401, "Invalid credentials")
    }

    const { accesstoken, refreshtoken } = await genrateAcessTokenandRefreshToken(user._id)
    const userloggedin = await User.findById(user._id).select("-password -refreshtoken")

    // Production-grade cookie options
    const cookieOptions = {
 httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
        maxAge : 3600000,
    }

    res
        .status(200)
        .cookie("refreshtoken", refreshtoken, cookieOptions)
        .cookie("accesstoken", accesstoken, cookieOptions)
        .json(
            new ApiResponse(200, "Login successful", {
                user: userloggedin,
                accesstoken,
                refreshtoken
            })
        )
})

const logout = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) {
        throw new ApiError(401, "Unauthorized")
    }

    await User.findByIdAndUpdate(
        user._id,
        {
            refreshtoken: null
        },
        { new: true }
    )

    // Production-grade cookie clearing options
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: '.vercel.app',
        path: '/'
    }

    res
        .status(200)
        .clearCookie("accesstoken", cookieOptions)
        .clearCookie("refreshtoken", cookieOptions)
        .json(new ApiResponse(200, "Logged out successfully"))
})

const getpendingusers = asyncHandler(async (req, res) => {
    const users = await User.find({ isAllowed: false })
    if (!users?.length) {
        return res.status(200).json(
            new ApiResponse(200, "No pending requests found", { users: [] })
        )
    }
    res.status(200).json(new ApiResponse(200, "Fetched pending requests", { users }))
})

const grantUser = asyncHandler(async (req, res) => {
    const { username, email } = req.body

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOneAndUpdate(
        {
            $or: [{ username }, { email }]
        },
        {
            isAllowed: true
        },
        {
            new: true
        }
    )

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    res.status(200).json(new ApiResponse(200, "User approved successfully", { user }))
})

const bannedUser = asyncHandler(async (req, res) => {
    const { username, email } = req.body

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required")
    }

    await BannedEmail.create({ email })
    const user = await User.findOneAndDelete({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    res.status(200).json(new ApiResponse(200, "User banned successfully", { user }))
})

const changepassword = asyncHandler(async (req, res) => {
    const { oldpassword, newpassword, confirmpassword } = req.body
    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(401, "Unauthorized")
    }

    if ([oldpassword, newpassword, confirmpassword].some(item => !item || item?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    if (newpassword !== confirmpassword) {
        throw new ApiError(400, "New password and confirm password do not match")
    }

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordCorrect = await user.ispasswordCorrect(oldpassword)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid old password")
    }

    user.password = newpassword
    await user.save({ validateBeforeSave: true })

    res.status(200).json(new ApiResponse(200, "Password changed successfully"))
})

export {
    registerUser,
    loginUser,
    getpendingusers,
    grantUser,
    bannedUser,
    logout,
    changepassword
}
