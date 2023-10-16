import { Player } from "./utils/Player.js";
import { safeZones } from "./utils/constants.js";
import query from "./db.js";

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
