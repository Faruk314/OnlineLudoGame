import { Player } from "./utils/Player.js";

export const createGame = (usersIds) => {
  const game = {
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

  game.players = usersIds.map(
    (userId, index) => new Player({ color: colors[index], userId: userId })
  );
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
  console.log(gameState, "gameState");

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
