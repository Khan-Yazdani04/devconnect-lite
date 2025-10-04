
// helper file likh rakhi hai utils mein asyncHandler
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {ApiResponse} from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";



const generateAccessAndRefereshToken = async (userId) =>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken =user.generateRefreshToken()
        // console.log(user)

        // saving refresh token in database
        user.refreshToken = refreshToken
       
        await user.save({ validateBeforeSave: false })

        // console.log(accessToken)
        // console.log(refreshToken)
        return {accessToken, refreshToken}
    }
    catch(error){
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

// registers new users
const registerUser = asyncHandler( async (req, res) => {
   
     const {name, email, role, password} =req.body
    if(
        [name, email, password, role].some((field) =>
            field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
    
    const existedUser = await User.findOne({
        $or: [ {name}, {email} ]
    })
    
    if(existedUser){
        throw new ApiError(409, "name or emial already exists")
    }

    
    const user = await User.create({
        name,
        email,
        role,
        password, 
    })
    // .select removes sensitive fields like password and refreshToken if user finds the created user
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError (500, "Something went wrong while  registreing the user")
    }   

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully!")
    )

})

// when user logs in
const loginUser = asyncHandler(async (req,res) => {
    

   const {name, email, password} = req.body

   if(!name && !email){
    throw new ApiError(400,"name or email is required!")
   }
   
   const user = await User.findOne({
    $or : [{ name } , { email }]
   })
   console.log(user)

   if(!user){
    throw new ApiError(400,"User does not exist")
   }
//  capital User sey hamein mongodb ky methods ka access hoga aur small user sey hamein hamarey custom methods jo hm ney bnaey haan unka access hoga  
   const isPasswordValid = await user.isPasswordCorrect(password)
   if(!isPasswordValid){
    throw new ApiError(401,"Invalid user credentials")
   }

   const {accessToken, refreshToken} = await generateAccessAndRefereshToken(user._id)

   const loggedInUser = await User.findById(user._id)
   .select("-password -refreshToken")

//    cookie setup sirf server side pr access hota hai innka
   const options = {
        httpOnly: true,
        secure: true
   }
   return res.status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User Logged In Successfully"
        )
   )
})


const logoutUser = asyncHandler( async (req, res) => {
   
    await User.findByIdAndUpdate(
        // aggregation pipelines
        req.user._id,
        {
            // mongodb operator used to remove a field here it deletes the refreshToken field from the user document in database so after logout refresh token is removed: so can be reused
            $unset: {
                refreshToken: "",
            }
        },
        // this tells mongoose to return updated document
        {
            new: true
        }
    )
   
    const options = {
        // means cookie cannot be accessed via through javascript(adds secutity)
        httpOnly: true,
        // cookie will be sent over HTTPS(NOT HTTP)
        secure: true
    }
    return res
    .status(200)
    // this clear both cookie safely during logout
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {} ,"User logged out Successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
   
    const incommingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

    if(!incommingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try{
        const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if(!user){
        throw new ApiError(401, "Invalid Refresh Token")
    }
   
    if(incommingRefreshToken !== user.refreshToken){
        throw new ApiError(401, "Refresh token is expired or used")
    }
   
    const options = {
        httpOnly : true,
        secure : true,
    } 

    const {accessToken, refreshToken} = await generateAccessAndRefereshToken(user._id)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {accessToken, refreshToken},
            "Access token refreshed"
        )
    )
    }
    catch(error){
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res)=>{
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword) 

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old Password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "Password changed Successfully"
    ))
})

const getCurrentUser = asyncHandler(async (req, res)=>{
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "Current User Fetched Successfully"
    ))
})

const updateAccountDetails = asyncHandler(async (req,res)=>{
    const{name, email} = req.body
    if(!name || !email){
        throw new ApiError(400, "All fields are required!")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { name , email }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        user,
        "Account Updated Successfully"
    ))
})



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
}
