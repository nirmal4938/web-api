// src/routes/ElectionRoutes.js
import express from 'express';
import {
  createElection,
  getAllElections,
  getElectionById,
  updateElection,
  deleteElection,
} from '../controllers/ElectionController.js';
import { authenticateJWT } from '../middlewares/AuthMiddleware.js';
import { checkPermission } from '../middlewares/checkPermission.js';

const router = express.Router();
// checkPermission('create', 'Election')
router.post('/', authenticateJWT, createElection);
router.get('/', getAllElections);
router.get('/:id', getElectionById);
router.put('/:id', authenticateJWT, checkPermission('update', 'Election'), updateElection);
router.delete('/:id', authenticateJWT, checkPermission('delete', 'Election'), deleteElection);

export default router;
