import { Router } from "express"
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

// Public routes
router.post("/register", registerUser)   // signup
router.post("/login", loginUser)         // signin
router.post("/refresh-token", refreshAccessToken)

// Protected routes (need JWT)
router.post("/logout", verifyJWT, logoutUser)
router.post("/change-password", verifyJWT, changeCurrentPassword)
router.get("/me", verifyJWT, getCurrentUser)
router.patch("/update-account", verifyJWT, updateAccountDetails)

export default router