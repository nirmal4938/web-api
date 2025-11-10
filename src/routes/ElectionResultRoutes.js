// src/routes/ElectionResultRoutes.js
import express from 'express';
import {
  getAllResults,
  getResultByElectionId,
  calculateElectionResult,
} from '../controllers/ElectionResultController.js';
import { authenticateJWT } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// fetch all results
router.get('/', getAllResults);

// get result of a specific election
router.get('/:electionId', getResultByElectionId);

// admin or system call to compute results
router.post('/calculate/:electionId', authenticateJWT, calculateElectionResult);

export default router;
