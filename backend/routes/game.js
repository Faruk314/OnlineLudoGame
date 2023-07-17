import express from "express";
import { initGame } from "../controllers/game.js";

const router = express.Router();

router.post("/initGame", initGame);

export default router;
