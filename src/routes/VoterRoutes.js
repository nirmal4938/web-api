// src/routes/VoterRoutes.js
import express from 'express';
import {
  registerVoter,
  getAllVoters,
  getVoterById,
  updateVoter,
  deleteVoter,
} from '../controllers/VoterController.js';
import { authenticateJWT } from '../middlewares/AuthMiddleware.js';
import { checkPermission } from '../middlewares/checkPermission.js';

const router = express.Router();

router.post('/', authenticateJWT, checkPermission('create', 'Voter'), registerVoter);
router.get('/', getAllVoters);
router.get('/:id', getVoterById);
router.put('/:id', authenticateJWT, checkPermission('update', 'Voter'), updateVoter);
router.delete('/:id', authenticateJWT, checkPermission('delete', 'Voter'), deleteVoter);

export default router;
