// src/routes/VoteRoutes.js
import express from "express";
import {
  castVote,
  getAllVotes,
  getVoteById,
  updateVote,
  deleteVote,
  getUserVote, // 👈 new
} from "../controllers/VoteController.js";
import { authenticateJWT } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/", authenticateJWT, castVote);
router.get("/", getAllVotes);
router.get("/me", authenticateJWT, getUserVote); 
router.get("/:id", getVoteById);
router.put("/:id", authenticateJWT, updateVote);
router.delete("/:id", authenticateJWT, deleteVote);

export default router;
