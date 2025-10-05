import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Bid } from "../models/bid.model.js";
import { Project } from "../models/project.model.js";
import { Developer } from "../models/developer.model.js";

// place bids
const placeBid = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "developer") {
    throw new ApiError(403, "Only developers can place bids");
  }

  const { projectId, amount, message } = req.body;

  if (!projectId || !amount) {
    throw new ApiError(400, "projectId and amount are required");
  }

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");
  if (project.status !== "open") throw new ApiError(400, "Project is not open for bids");

  const existing = await Bid.findOne({
    project: projectId,
    developer: req.user._id,
  });

  if (existing) {
    throw new ApiError(400, "You already placed a bid on this project");
  }

  const bid = await Bid.create({
    project: projectId,
    developer: req.user._id,
    amount,
    message,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, bid, "Bid placed successfully"));
});

// this is for getting all bids for a project
const getAllBidsForProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  // with populate we get full refrenced document
  const bids = await Bid.find({ project: projectId })
    .populate("developer", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, bids, "Bids fetched successfully"));
});

// own bids placed 
const getMyBids = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "developer") {
    throw new ApiError(403, "Only developers can view their bids");
  }

  // get all refrence documents
  const bids = await Bid.find({ developer: req.user._id })
    .populate("project", "title status")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, bids, "Your bids fetched successfully"));
});

// update any bid
const updateBid = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "developer") {
    throw new ApiError(403, "Only developers can update bids");
  }

  const { bidId } = req.params;
  const { amount, message } = req.body;

  const bid = await Bid.findById(bidId);
  if (!bid) throw new ApiError(404, "Bid not found");

  if (bid.developer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own bid");
  }

  const project = await Project.findById(bid.project);
  if (project.status !== "open") {
    throw new ApiError(400, "Cannot update bid; project is closed");
  }

  bid.amount = amount || bid.amount;
  bid.message = message || bid.message;
  await bid.save();

  return res
    .status(200)
    .json(new ApiResponse(200, bid, "Bid updated successfully"));
});

// delete a bid you earlier made
const deleteBid = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "developer") {
    throw new ApiError(403, "Only developers can delete bids");
  }

  const { bidId } = req.params;

  const bid = await Bid.findById(bidId);
  if (!bid) throw new ApiError(404, "Bid not found");

  if (bid.developer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own bid");
  }

  const project = await Project.findById(bid.project);
  if (project.status !== "open") {
    throw new ApiError(400, "Cannot delete bid; project is closed");
  }

  await Bid.findByIdAndDelete(bidId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Bid deleted successfully"));
});


export {
  placeBid,
  getAllBidsForProject,
  getMyBids,
  updateBid,
  deleteBid
}