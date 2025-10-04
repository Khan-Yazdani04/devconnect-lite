import express from "express";
import {
  getDeveloperProfile,
  updateDeveloperProfile,
  getAllDevelopers,
  getDeveloperBids,
  getDeveloperProjects,
} from "../controllers/developer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// developer routes
router.get("/me", verifyJWT, getDeveloperProfile);
router.put("/update", verifyJWT, updateDeveloperProfile);
router.get("/bids", verifyJWT, getDeveloperBids);
router.get("/projects", verifyJWT, getDeveloperProjects);


router.get("/all", getAllDevelopers);

export default router;