import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },

    description:{
        type: String,
    },
    
    techStack:[{
        type: String
    }],

    estimatedBudget: {
        type: Number
    },

    status: {
        type: String,
        enum:["open", "in progress", "completed"],
        default: "open",
    },

    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }

},{
    timestamps: true
})

export const Project = mongoose.model("Project",projectSchema)