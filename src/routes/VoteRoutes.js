// src/routes/VoteRoutes.js
import express from 'express';
import {
  castVote,
  getAllVotes,
  getVoteById,
  updateVote,
  deleteVote,
} from '../controllers/VoteController.js';
import { authenticateJWT } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/', authenticateJWT, castVote);
router.get('/', getAllVotes);
router.get('/:id', getVoteById);
router.put('/:id', authenticateJWT, updateVote);
router.delete('/:id', authenticateJWT, deleteVote);

export default router;
