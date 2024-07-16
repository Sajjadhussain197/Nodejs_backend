import { json } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import { uploadCloudinary } from "../../utils/cloudinary.js"

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

export { registerUser } 