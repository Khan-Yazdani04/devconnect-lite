import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";
import { Bid } from "../models/bid.model.js";

// for creating a client
const createProject = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "client") {
    throw new ApiError(403, "Only clients can create projects");
  }

  const { title, description, budget, deadline } = req.body;

  if (!title || !description || !budget || !deadline) {
    throw new ApiError(400, "All fields are required");
  }

  const project = await Project.create({
    title,
    description,
    budget,
    deadline,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

// for getting all open projects
const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ status: "open" })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "All open projects fetched"));
});

// getting the project by and the bids placed on it
const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId).populate("createdBy", "name email");
  if (!project) throw new ApiError(404, "Project not found");

  const bids = await Bid.find({ project: projectId })
    .populate("developer", "name email amount")
    .sort({ amount: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { project, bids }, "Project details fetched"));
});


// only owner can update project and if open as well
export const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, budget, deadline } = req.body;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (project.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own project");
  }

  if (project.status !== "open") {
    throw new ApiError(400, "Cannot update project once closed");
  }

  project.title = title || project.title;
  project.description = description || project.description;
  project.budget = budget || project.budget;
  project.deadline = deadline || project.deadline;

  await project.save();

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

// Delete the project and if only open
export const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (project.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own project");
  }

  if (project.status !== "open") {
    throw new ApiError(400, "Cannot delete project once closed");
  }

  await Project.findByIdAndDelete(projectId);
  await Bid.deleteMany({ project: projectId }); // remove related bids

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Project deleted successfully"));
});

// close the projects 
const closeProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (project.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only close your own project");
  }

  if (project.status === "closed") {
    throw new ApiError(400, "Project is already closed");
  }

  project.status = "closed";
  await project.save();

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project closed successfully"));
});

export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  closeProject
}