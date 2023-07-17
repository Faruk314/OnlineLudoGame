import express from "express";
import { initGame } from "../controllers/game.js";
import { protect } from "../utils/protect.js";

const router = express.Router();

router.post("/initGame", protect, initGame);

export default router;
