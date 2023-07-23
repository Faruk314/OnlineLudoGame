import express from "express";
import { protect } from "../utils/protect.js";
import { changeAvatar } from "../controllers/user.js";

const router = express.Router();

router.post("/changeAvatar", protect, changeAvatar);

export default router;
