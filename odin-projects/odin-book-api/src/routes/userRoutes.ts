import express from "express";
import { followUser, respondToFollowRequest, unfollowUser, updateUserProfile } from "../controllers/userController";

const router = express.Router();

router.put("/", updateUserProfile);

router.post("/:followingId/follow", followUser);
router.post("/:followingId/unfollow", unfollowUser);

router.post("/follow-requests/:followerId", respondToFollowRequest);

export default router;