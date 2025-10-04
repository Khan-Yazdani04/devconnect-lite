import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

// async method hai appko promise return kry ga execution k time 
const connectDB = async () =>{
    try {
        const connectionInstance = await mongoose.connect (`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB connected !! DATABASE HOST ${connectionInstance.connection.host}`)
        // console.log(connectionInstance);
    } catch (error) {
        console.log("MongoDB connection Failed", error)
        process.exit(1);
    }
}

export default connectDB;