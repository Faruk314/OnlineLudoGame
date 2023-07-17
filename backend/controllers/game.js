import asyncHandler from "express-async-handler";
import { client } from "../app.js";
import { Player } from "../utils/Player.js";

export const initGame = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const { chosenplayersNum, chosenColorsArr } = req.body;
  let colors = ["red", "blue", "yellow", "green"];

  const game = {
    isGameOver: false,
    chosenPlayers: chosenplayersNum,
    chosenColors: chosenColorsArr,
    currentPlayerTurnIndex: 0,
    highlightedPawns: [],
    randomNum: null,
    playerTurns: [],
    players: [],
  };

  if (chosenplayersNum === 4) {
    game.playerTurns = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    colors = colors.sort(() => Math.random() - 0.5);
    game.currentPlayerTurnIndex = game.playerTurns[0];
  }
  if (chosenplayersNum === 3) {
    game.playerTurns = [0, 1, 2].sort(() => Math.random() - 0.5);
    game.currentPlayerTurnIndex = game.playerTurns[0];
  }
  if (chosenplayersNum === 2) {
    game.playerTurns = [0, 1].sort(() => Math.random() - 0.5);
    game.currentPlayerTurnIndex = game.playerTurns[0];
  }

  for (let i = 0; i < chosenplayersNum; i++) {
    let player = new Player({ color: chosenColorsArr[i] });
    game.players.push(player);
  }

  try {
    await client.set(userId, JSON.stringify(game));

    res.status(200).json("Game successfully initialized");
  } catch (error) {
    throw new Error("Could not update db in initGame controller");
  }
});
