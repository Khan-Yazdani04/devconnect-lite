import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
const app = express();
// configurations
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(cookieParser())


import userRoutes from "./routes/user.route.js";
import bidRoutes from "./routes/bid.route.js";
import projectRoutes from "./routes/project.route.js";
import developerRoutes from "./routes/developer.route.js";

// routes
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/bid", bidRoutes)
app.use("/api/v1/projects", projectRoutes)
app.use("/api/v1/developers", developerRoutes);
export {app}