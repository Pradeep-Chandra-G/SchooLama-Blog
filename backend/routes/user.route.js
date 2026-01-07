import express from "express";
import {
  getUserSavedPosts,
  getUserSavedPostsDetails,
  savePost,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/saved", getUserSavedPosts);
router.get("/saved/details", getUserSavedPostsDetails);
router.patch("/save", savePost);

export default router;
