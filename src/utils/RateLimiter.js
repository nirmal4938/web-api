// src/utils/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // max 20 requests per minute per IP
  message: 'Too many chat requests, please try again later.'
});
