import asyncHandler from "express-async-handler";
import { client } from "../app.js";
import { Player } from "../utils/Player.js";

export const initGame = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  let chosenplayersNum = req.body.chosenplayersNum;
  let chosenColorsArr = req.body.chosenColorsArr;

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
    chosenColorsArr = colors.sort(() => Math.random() - 0.5);
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

export const retrieveGameState = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  try {
    let data = await client.get(userId);
    const result = JSON.parse(data);

    res.status(200).json(result);
  } catch (error) {
    res.status(400);
    throw new Error("Error retrieving game state");
  }
});

export const updateGameState = asyncHandler(async (req, res) => {
  const { updatedGameState } = req.body;
  const userId = req.user.userId;

  try {
    await client.set(userId, JSON.stringify(updatedGameState));
    res.status(200).json("Game updated successfully");
  } catch (error) {
    res.status(400);
    throw new Error("Could not update game state");
  }
});
