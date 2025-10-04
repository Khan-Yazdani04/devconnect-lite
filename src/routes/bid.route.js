import express from "express";
import { placeBid, getAllBidsForProject, getMyBids, updateBid, deleteBid } from "../controllers/bid.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

//  this is for making all routes protected
router.use(verifyJWT); 

router.post("/place", placeBid);
router.get("/project/:projectId", getAllBidsForProject);
router.get("/my-bids", getMyBids);
router.put("/:bidId", updateBid);
router.delete("/:bidId", deleteBid);

export default router;