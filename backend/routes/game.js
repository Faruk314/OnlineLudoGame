import express from "express";
import {
  getMultiplayerGameState,
  initGame,
  retrieveGameState,
  updateGameState,
} from "../controllers/game.js";
import { protect } from "../utils/protect.js";

const router = express.Router();

router.post("/initGame", protect, initGame);

router.get("/retrieveGameState", protect, retrieveGameState);

router.post("/updateGameState", protect, updateGameState);

router.post("/getMultiplayerGameState", protect, getMultiplayerGameState);

export default router;
