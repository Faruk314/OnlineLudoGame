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
