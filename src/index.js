import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// ✅ Load environment variables
dotenv.config({ path: "./.env" });

// ✅ Register all models BEFORE routes/controllers load
import "./models/user.model.js";
import "./models/developer.model.js";
import "./models/project.model.js";
import "./models/bid.model.js";

// ✅ Connect to database and start server
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error", error);
      throw error;
    });

    const PORT = process.env.PORT || 5000; // 🔹 make sure your .env uses "PORT", not "port"
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("❌ MongoDB connection failed!", error);
  });
