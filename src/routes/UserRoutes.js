// src/routes/userRoutes.js
import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
} from '../controllers/UserController.js';
import { authenticateJWT } from '../middlewares/AuthMiddleware.js';
import { checkPermission } from '../middlewares/checkPermission.js';

const router = express.Router();

router.post('/', authenticateJWT,
  checkPermission('create', 'User'),createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Authentication
router.post('/login', loginUser);

export default router;
