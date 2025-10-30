// routes/SessionRoutes.js
import { Router } from "express";
// import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { authenticateJWT } from "../middlewares/AuthMiddleware.js";
import { getActiveSessions } from "../controllers/SessionController.js";

const router = Router();
router.get("/active", authenticateJWT, getActiveSessions);
export default router;
