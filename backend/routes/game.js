import express from "express";
import {
  deleteGameState,
  getGameState,
  getLeaderboard,
  initGame,
  updateGameState,
} from "../controllers/game.js";
import { protect } from "../utils/protect.js";

const router = express.Router();

router.post("/initGame", protect, initGame);

router.get("/getLeaderboard", getLeaderboard);

router.post("/updateGameState", protect, updateGameState);

router.post("/getGameState", protect, getGameState);

router.delete("/deleteGameState/:gameId", protect, deleteGameState);

export default router;
