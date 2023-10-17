import { Player } from "./utils/Player.js";
import { safeZones } from "./utils/constants.js";
import query from "./db.js";
import { client } from "./app.js";
import { getUser } from "./maps/userMap.js";
import { getGameId, removeUserFromGameMap, games } from "./maps/gameMap.js";

export const handlePlayerLeaving = async (io, userId) => {
  if (!userId)
    return console.log("User id does not exist in disconnect method");

  let countdown = 5000;

  //getGameId and remove the user
  let gameId = getGameId(userId);
  removeUserFromGameMap(userId);

  if (!gameId)
    return console.log("Could not get the game id in disconnect method");

  let gameData = await client.get(gameId);
  let gameState = JSON.parse(gameData);

  console.log(gameState, "gameState");

  if (!gameState) return console.log("Could not find game state in disconnect");

  const opponentId = gameState.players.find(
    (player) => player.userId !== userId
  ).userId;

  if (!opponentId)
    return console.log("Could not get opponentId in disconnect function");

  const opponentSocketId = getUser(opponentId);

  setTimeout(async () => {
    if (!games.has(userId)) {
      let gameData = await client.get(gameId);
      let gameStateExists = JSON.parse(gameData);

      if (!gameStateExists) return console.log("Game state does not exist");

      await client.del(gameId);

      io.to(opponentSocketId).emit("opponentLeft");
    }

    if (!games.has(userId) && !games.has(opponentId)) {
      await client.del(gameId);
    }
  }, countdown);
};

export const createGame = async (usersIds, gameId) => {
  const game = {
    gameId: gameId,
    isGameOver: false,
    chosenPlayers: null,
    chosenColors: [],
    currentPlayerTurnIndex: 0,
    highlightedPawns: [],
    randomNum: null,
    playerTurns: [],
    players: [],
    isMultiplayer: true,
  };
  const colors = ["green", "red", "blue", "yellow"].sort(
    () => Math.random() - 0.5
  );

  if (usersIds.length === 2) {
    game.playerTurns = [0, 1].sort(() => Math.random() - 0.5);
  } else {
    game.playerTurns = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  }

  for (let i = 0; i < usersIds.length; i++) {
    let playerId = usersIds[i];

    let q =
      "SELECT u.userName, u.userId, u.image FROM users u WHERE u.userId = ?";

    let playerData = await query(q, [playerId]);

    game.players.push(
      new Player({
        color: colors[i],
        userId: playerData[0].userId,
        userName: playerData[0].userName,
        image: playerData[0].image,
      })
    );
  }

  game.chosenColors = [colors[0], colors[1]];
  game.chosenPlayers = usersIds.length;

  return game;
};

export const updateLeaderboard = async (userId) => {
  try {
    let q =
      "INSERT INTO leaderboard (`userId`, `wins`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `wins` = `wins` + ?";

    await query(q, [userId, 1, 1]);

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
};

const switchTurns = (gameState) => {
  let nextPlayerTurn = gameState.currentPlayerTurnIndex + 1;

  if (nextPlayerTurn > gameState.playerTurns.length - 1) {
    nextPlayerTurn = 0;
  }

  gameState.currentPlayerTurnIndex = nextPlayerTurn;
};

export const highlightPawns = (gameState) => {
  const playerOnMove = gameState.players[gameState.currentPlayerTurnIndex];
  const highlighted = [];

  const randomNum = Math.floor(Math.random() * 6 + 1);
  // const randomNum = 2;
  // gameState.players[gameState.currentPlayerTurnIndex].pawnPositions = [
  //   116, 116, 116, 116,
  // ];

  gameState.randomNum = randomNum;

  playerOnMove.pawnPositions.forEach((position) => {
    //find pawns that are in a starting positions(playerZones)
    if (playerOnMove?.startingPositions.includes(position) && randomNum === 6) {
      highlighted.push(position);
    }

    //find pawns that are in path
    let positionIndex = playerOnMove.path.findIndex(
      (pathPosition) => pathPosition === position
    );

    if (positionIndex !== -1) {
      let nextPossiblePositionIndex = positionIndex + randomNum;

      let nextPossiblePosition = playerOnMove.path.find(
        (position, index) => index === nextPossiblePositionIndex
      );

      if (nextPossiblePosition === undefined) return;

      highlighted.push(position);
    }
  });

  if (highlighted.length > 0) {
    gameState.highlightedPawns = highlighted;
  } else {
    switchTurns(gameState);
  }
};

const findStartingPoint = (player) => {
  //this will find first available starting position
  let firstAvailablePosition = player.startingPositions.find(
    (position) => !player.pawnPositions.includes(position)
  );

  //return first free position
  return firstAvailablePosition;
};

const checkOpponentsPositions = (position, gameState) => {
  let pawnEaten = false;

  gameState.players.forEach((player, index) => {
    //this filters current player and just leaves opponents
    if (index !== gameState.currentPlayerTurnIndex) {
      //this finds opponent pawn at position currentPlayer just stepped
      const opponentPawnIndex = player.pawnPositions.indexOf(position);

      //if the position is found then the pawn is eaten and this find the free space at starting point
      if (opponentPawnIndex > -1 && !safeZones.includes(position)) {
        player.pawnPositions[opponentPawnIndex] = findStartingPoint(player);
        pawnEaten = true;
      }
    }
  });

  return pawnEaten;
};

export const handlePlayerMove = (gameState, pawnIndex) => {
  const playerOnMove = gameState.players[gameState.currentPlayerTurnIndex];

  //find that position in positions array and change it
  const positionIndex = playerOnMove.pawnPositions.findIndex(
    (position) => position === pawnIndex
  );

  //check if the move is made from startingPoints and add pawn to starting position
  if (playerOnMove?.startingPositions.includes(pawnIndex)) {
    gameState.players[gameState.currentPlayerTurnIndex].pawnPositions[
      positionIndex
    ] = playerOnMove.startingPoint;
    gameState.highlightedPawns = [];
    return;
  }

  //if the move is made from path move player to next posibble position
  let pathPositionIndex = playerOnMove?.path.findIndex(
    (pathPosition) => pathPosition === pawnIndex
  );

  if (pathPositionIndex === undefined) return;

  let nextPossiblePositionIndex = gameState.randomNum + pathPositionIndex;

  let nextPosiblePosition = playerOnMove?.path.find(
    (position, index) => index === nextPossiblePositionIndex
  );

  if (nextPosiblePosition) {
    gameState.players[gameState.currentPlayerTurnIndex].pawnPositions[
      positionIndex
    ] = nextPosiblePosition;

    //check if the pawn is at last position
    let isOnLastPosition = nextPosiblePosition === playerOnMove.endpoint;

    //this function checks if the game is over
    if (isOnLastPosition) {
      gameState.players[gameState.currentPlayerTurnIndex].pawnsInFinalZone += 1;

      if (
        gameState.players[gameState.currentPlayerTurnIndex].pawnsInFinalZone ===
        4
      ) {
        return (gameState.isGameOver = true);
      }
    }

    //check if there is an opponent pawn on that position
    let pawnEaten = checkOpponentsPositions(nextPosiblePosition, gameState);

    if (
      pawnEaten === false &&
      gameState.randomNum !== 6 &&
      isOnLastPosition === false
    ) {
      switchTurns(gameState);
    }

    gameState.highlightedPawns = [];
  }
};
