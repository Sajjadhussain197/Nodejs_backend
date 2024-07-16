import { json } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import { uploadCloudinary } from "../../utils/cloudinary.js"

const generateAccessTokenRefreshToken = async (userId)=>{
   try {
     const user= await User.findById(userId)
     const accessToken = user.generateAccessToken();
     const refreshToken = user.generateRefreshToken();

     user.refreshToken = refreshToken;
     await user.save({validateBeforeSave:false})
     return {accessToken, refreshToken}
     
   } catch (error) {
    throw new ApiError(500,"something went wrong while generating refresh and access token")
    
   }
}

const registerUser = asyncHandler(async (req,res)=>{
   // get user data from frontend
   // validate the data
   // check in db
   // check for image
   // upload cloudinary
   // create user objec, entery in db
   // remove password from responsse
   // check for user creation in  db
   // send response
   const {fullName, username, email, password}= req.body;
   console.log(fullName, username,password, email)
   if(
    [fullName,email,password,username].some((field)=>field?.trim()==='')
   ){
    throw new ApiError(400,"All the fieleds are requied")
   }

   const existinguser = await User.findOne({$or:[{username},{email}]});
   if (existinguser) {
    throw new ApiError(409, "User with this email or username already exists")
    
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage && req.files.coverImage.length > 0))
   {

       const coverImageLocalPath = req.files?.coverImage[0]?.path;
   }





    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
        
    }

    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath)
    console.log(avatar,coverImage)
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
        
    }

   const user = await User.create({
    fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user")
    }

    res.status(201).json(
        new ApiResponse(200, createdUser, "User created Successfully!!!!")
    )
})

const loginUser = asyncHandler(async (req, res)=>{
    //get data from front end , req,body
    //validate data, emai, username, password
    // check user from email
    //get user 
    //check password
    //access token and refreshtoken
    //send cookies
    const {username, email, password}=req.body

    if(!username || !email){
        throw new ApiError(400,"Username or Email is required")
    }
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if (!user) {
        throw new ApiError(404,"User doesnt exist")
        
    }
    const ispasswordValid = await user.isPasswordCorrect(password)
    if (!ispasswordValid) {
        throw new ApiError(401, "the password is incorrect")
        
    }
    generateAccessTokenRefreshToken(user._id)

    const loggedInUser= await User.findById(user._id).select(
        "-password, -refreshToken"

    )

    const options = {
        httpOnly: true,
        secure:false
    }
    return res.status(200).cookie("accessToken",accessToken, options).cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {   user:loggedInUser, accessToken, refreshToken  },
            "User logged In Successfully"
    )
    )

})



const loggedOutUser = asyncHandler(async (req,res)=>{

})







export { 
    registerUser,
    loginUser,
    loggedOutUser
 } 

