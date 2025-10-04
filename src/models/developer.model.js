import mongoose from "mongoose";
const developerSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        // hashed
        // come back again
        password:{
            type: String,
            required: true,
        },
        skills:[{
            type: String
        }],
        role:{
            type: String,
            default: "Developer"
        },
},{
    timestamps: true,
})

export const Developer = mongoose.model("Developer", developerSchema)