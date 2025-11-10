// src/routes/CandidateRoutes.js
import express from 'express';
import {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from '../controllers/CandidateController.js';
import { authenticateJWT } from '../middlewares/AuthMiddleware.js';
import { checkPermission } from '../middlewares/checkPermission.js';

const router = express.Router();

// checkPermission('create', 'Candidate')
router.post('/', authenticateJWT, createCandidate);
router.get('/', getAllCandidates);
router.get('/:id', getCandidateById);
router.put('/:id', authenticateJWT, checkPermission('update', 'Candidate'), updateCandidate);
router.delete('/:id', authenticateJWT, checkPermission('delete', 'Candidate'), deleteCandidate);

export default router;
