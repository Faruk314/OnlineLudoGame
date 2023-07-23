import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./utils/error.js";
import authRoutes from "./routes/auth.js";
import gameRoutes from "./routes/game.js";
import userRoutes from "./routes/user.js";
import { Redis } from "ioredis";
import http from "http";
import setupSocket from "./socket.js";
config();

const app = express();

const server = http.createServer(app);
setupSocket();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

export const client = new Redis({
  host: "localhost",
  port: 6379,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/users", userRoutes);

app.listen(process.env.PORT, () => {
  console.log("server is listening on", process.env.PORT);
});

app.use(errorHandler);
