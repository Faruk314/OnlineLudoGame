import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { client } from "./app.js";
import { v4 as uuidv4 } from "uuid";
import {
  createGame,
  handlePlayerMove,
  highlightPawns,
  updateLeaderboard,
} from "./game.js";
import {
  addUser,
  getUser,
  removeUser,
  twoPlayersQueue,
} from "./maps/userMap.js";

export default function setupSocket() {
  const server = http.createServer();

  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decodedToken.userId;
      next();
    } catch (error) {
      console.log(error);
    }
  });

  io.on("connection", (socket) => {
    console.log("new socket connection", socket.userId);

    addUser(socket.userId, socket.id);

    socket.on("reconnectToRoom", (gameId) => {
      const userSocketId = getUser(socket.userId);

      if (userSocketId) {
        const userSocket = io.sockets.sockets.get(userSocketId);

        userSocket.join(gameId);
      }
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("disconnected");
    });

    socket.on("findMatch", async () => {
      if (!twoPlayersQueue.includes(socket.userId)) {
        twoPlayersQueue.push(socket.userId);
      }

      if (twoPlayersQueue.length > 1) {
        const firstPlayerId = twoPlayersQueue.splice(0, 1)[0];
        const secondPlayerId = twoPlayersQueue.splice(0, 1)[0];

        const playerOnesocketId = getUser(firstPlayerId);
        const playerTwoSocketId = getUser(secondPlayerId);

        if (!playerOnesocketId || !playerTwoSocketId) {
          return console.log("playerSocketId not found!");
        }

        const playerOneSocket = io.sockets.sockets.get(playerOnesocketId);
        const playerTwoSocket = io.sockets.sockets.get(playerTwoSocketId);

        let gameId = uuidv4();

        playerOneSocket.join(gameId);
        playerTwoSocket.join(gameId);

        let players = [firstPlayerId, secondPlayerId];

        let gameState = await createGame(players, gameId);

        await client.set(gameId, JSON.stringify(gameState));

        io.to(gameId).emit("gameStart", gameId);
      }
    });

    socket.on("cancelFindMatch", () => {
      twoPlayersQueue = twoPlayersQueue.filter(
        (userId) => userId !== socket.userId
      );
    });

    socket.on("diceRoll", async (gameId) => {
      const gameData = await client.get(gameId);
      let gameState = JSON.parse(gameData);

      highlightPawns(gameState);

      await client.set(gameId, JSON.stringify(gameState));

      io.to(gameId).emit("diceRolled", { gameId, ...gameState });
    });

    socket.on("playerMove", async (data) => {
      const gameData = await client.get(data.gameId);
      let gameState = JSON.parse(gameData);

      handlePlayerMove(gameState, data.pawnIndex);

      let result = await client.set(data.gameId, JSON.stringify(gameState));

      let leaderboardUpdated;

      if (gameState.isGameOver) {
        const winner =
          gameState.players[gameState.currentPlayerTurnIndex].userId;
        leaderboardUpdated = await updateLeaderboard(winner);
      }

      io.to(data.gameId).emit("playerMoved", {
        gameId: data.gameId,
        ...gameState,
      });

      if (leaderboardUpdated && result === "OK") {
        await client.del(data.gameId);
      }
    });

    socket.on("leaveGame", async (gameId) => {
      await client.del(gameId);

      console.log(gameId, "gid");

      socket.leave(gameId);

      io.to(gameId).emit("opponentLeft");
    });
  });

  io.listen(5001);
}
