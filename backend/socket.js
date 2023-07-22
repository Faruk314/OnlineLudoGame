import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import query from "./db.js";
import { client } from "./app.js";
import { v4 as uuidv4 } from "uuid";
import { createGame, highlightPawns } from "./game.js";

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

  let users = new Map();

  //users that are searching for 2 players match
  let twoPlayersQueue = [];

  //users that are searching for 4 players match
  let fourPlayerQueue = [];

  const addUser = (userId, socketId) => {
    if (!users.has(userId)) {
      users.set(userId, socketId);
    }
  };

  const removeUser = (socketId) => {
    const userEntries = [...users.entries()];

    const usersEntriesFilterd = userEntries.filter(
      ([_, value]) => value !== socketId
    );

    users = new Map(usersEntriesFilterd);
  };

  const getUser = (userId) => {
    return users.get(userId);
  };

  io.on("connection", (socket) => {
    console.log("new socket connection", socket.userId);

    addUser(socket.userId, socket.id);

    socket.on("reconnectToRoom", (gameRoomId) => {
      const userSocketId = getUser(socket.userId);

      if (userSocketId) {
        const userSocket = io.sockets.sockets.get(userSocketId);

        userSocket.join(gameRoomId);
      }
    });

    socket.on("findMatch", async (playersNumber) => {
      if (playersNumber !== 2 && playersNumber !== 4) {
        console.log("Invalid number of players");
        return;
      }

      if (playersNumber === 4) {
        if (!fourPlayerQueue.includes(socket.userId)) {
          fourPlayerQueue.push(socket.userId);
        }

        if (fourPlayerQueue.length > 3) {
          const players = [];
          const gameId = uuidv4();

          for (let i = 0; i < 4; i++) {
            const playerId = fourPlayerQueue.splice(0, 1)[0];
            players.push(playerId);
            const socketId = getUser(playerId);
            const playerSocket = io.sockets.sockets.get(socketId);
            playerSocket.join(gameId);
          }

          const [firstPlayerId, secondPlayerId, thirdPlayerId, fourthPlayerId] =
            players;

          let q =
            "INSERT INTO games (`gameId`,`playerOne`,`playerTwo`,`playerThree`,`playerFour`) VALUES (?,?,?,?,?)";

          let data = await query(q, [
            gameId,
            firstPlayerId,
            secondPlayerId,
            thirdPlayerId,
            fourthPlayerId,
          ]);

          let gameState = createGame(players);
          await client.set(gameId, JSON.stringify(gameState));

          io.to(gameId).emit("gameStart", gameId);
        }
      }

      if (playersNumber === 2) {
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

          let q =
            "INSERT INTO games (`gameId`,`playerOne`,`playerTwo`) VALUES (?,?,?)";

          let data = await query(q, [gameId, firstPlayerId, secondPlayerId]);

          playerOneSocket.join(gameId);
          playerTwoSocket.join(gameId);

          let players = [firstPlayerId, secondPlayerId];

          let gameState = createGame(players);

          await client.set(gameId, JSON.stringify(gameState));

          io.to(gameId).emit("gameStart", gameId);
        }
      }
    });

    socket.on("cancelFindMatch", (playersNumber) => {
      if (playersNumber !== 2 && playersNumber !== 4) {
        return console.log("Invalid players number");
      }

      if (playersNumber === 2) {
        twoPlayersQueue = twoPlayersQueue.filter(
          (userId) => userId !== socket.userId
        );
      } else {
        fourPlayerQueue = fourPlayerQueue.filter(
          (userId) => userId !== socket.userId
        );
      }
    });

    socket.on("diceRoll", async (gameId) => {
      const gameData = await client.get(gameId);
      let gameState = JSON.parse(gameData);

      highlightPawns(gameState);

      await client.set(gameId, JSON.stringify(gameState));

      io.to(gameId).emit("diceRolled", gameState);
    });
  });

  io.listen(5001);
}
