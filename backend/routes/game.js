import express from "express";
import {
  initGame,
  retrieveGameState,
  updateGameState,
} from "../controllers/game.js";
import { protect } from "../utils/protect.js";

const router = express.Router();

router.post("/initGame", protect, initGame);

router.get("/retrieveGameState", protect, retrieveGameState);

router.post("/updateGameState", protect, updateGameState);

export default router;
