import express from 'express';
import { createChatMessage, streamChat } from '../controllers/ChatController.js';
import { chatRateLimiter } from '../utils/RateLimiter.js';

const router = express.Router();

// POST → create a message & get botMessageId
router.post('/', chatRateLimiter, createChatMessage);

// GET → SSE streaming
router.get('/stream', chatRateLimiter, streamChat);

export default router;
