import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        Trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },
    role:{
        type: String,
        default: "user"
    },
    refreshToken: {
        type: String
    }
},{timestamps: true}) 

 userSchema.pre("save", async function(next){

    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

 userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password, this.password)
}

//  json web tokens for acceess and refresh tokens
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        // Payload
        {
            _id: this._id, // auto generated mongodb id
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        // secretKey
        process.env.ACCESS_TOKEN_SECRET,
        // expiry/options
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User", userSchema)