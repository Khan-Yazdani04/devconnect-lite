import mongoose, { Types } from "mongoose"
const bidSchema = new mongoose.Schema({
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required: true
    },
    developer:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Developer",
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    message: {
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
},{
    timestamps: true,
})

export const Bid = mongoose.model("Bid", bidSchema )