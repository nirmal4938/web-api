import express from 'express';
import validate from '../middlewares/ValidateMiddleware.js';
import { registerSchema, loginSchema } from '../validations/AuthValidation.js';
import { register, login, logout, refreshToken } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);

export default router;
