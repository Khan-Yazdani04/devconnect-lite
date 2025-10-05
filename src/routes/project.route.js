import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  closeProject,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyJWT, createProject);
router.get("/all", getAllProjects);
router.get("/:projectId", verifyJWT, getProjectById);
router.put("/:projectId", verifyJWT, updateProject);
router.delete("/:projectId", verifyJWT, deleteProject);

// ✅ Use PATCH — semantically correct for closing
router.patch("/:projectId/close", verifyJWT, closeProject);

export default router;
