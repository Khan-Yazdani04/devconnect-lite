import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Bid } from "../models/bid.model.js";
import { Project } from "../models/project.model.js";

//  getting the developer profile
const getDeveloperProfile = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "developer") {
    throw new ApiError(403, "Only developers can access this route");
  }

  const developer = await User.findById(req.user._id).select("-password -refreshToken");

  if (!developer) throw new ApiError(404, "Developer not found");

  return res
    .status(200)
    .json(new ApiResponse(200, developer, "Developer profile fetched successfully"));
});

// updating the developer profile
const updateDeveloperProfile = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "developer") {
    throw new ApiError(403, "Only developers can update their profile");
  }

  const { name, email, skills, experience } = req.body;

  const developer = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        ...(name && { name }),
        ...(email && { email }),
        ...(skills && { skills }), // optional additional fields in model
        ...(experience && { experience }),
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, developer, "Developer profile updated successfully"));
});

// getting all the developer profile
const getAllDevelopers = asyncHandler(async (req, res) => {
  // optional: only admin
  // if (!req.user || req.user.role !== "admin") {
  //   throw new ApiError(403, "Only admin can view all developers");
  // }

  const developers = await User.find({ role: "developer" }).select(
    "name email skills experience createdAt"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, developers, "All developers fetched successfully"));
});

// bids that the developer haas placed
const getDeveloperBids = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "developer") {
    throw new ApiError(403, "Only developers can view their bids");
  }

  const bids = await Bid.find({ developer: req.user._id })
    .populate("project", "title status budget")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, bids, "Developer bids fetched successfully"));
});

// info on which projects developer has worked
 const getDeveloperProjects = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "developer") {
    throw new ApiError(403, "Only developers can view their projects");
  }

  // Example logic: Suppose Project has field `assignedTo` for developer
  const projects = await Project.find({ assignedTo: req.user._id })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Developer projects fetched successfully"));
});


export {
  getDeveloperProfile,
  updateDeveloperProfile,
  getAllDevelopers,
  getDeveloperBids,
  getDeveloperProjects
}