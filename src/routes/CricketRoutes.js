import express from "express";
import { getPlayerInfo, getTournamentInfo, searchPlayers } from "../controllers/CricketController.js";
import { authenticateJWT } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Public: Fetch player details (Wikipedia)
router.get("/players/:slug", getPlayerInfo);

// Public: Search players by keyword
router.get("/players/search/:query", searchPlayers);

// Public: Fetch tournament details
router.get("/tournaments/:name", getTournamentInfo);

// Optional: Protected route if you want admin-only data
router.post("/tournaments/add", authenticateJWT, (req, res) => {
  res.json({ success: true, message: "Tournament added (mock route)" });
});

export default router;
