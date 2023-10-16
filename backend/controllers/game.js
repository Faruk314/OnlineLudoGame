import asyncHandler from "express-async-handler";
import { client } from "../app.js";
import { Player } from "../utils/Player.js";
import query from "../db.js";
import { v4 as uuidv4 } from "uuid";

export const initGame = asyncHandler(async (req, res) => {
  const gameId = uuidv4();
  let chosenplayersNum = req.body.chosenplayersNum;
  let chosenColorsArr = req.body.chosenColorsArr;

  let colors = ["red", "blue", "yellow", "green"];

  const game = {
    gameId: gameId,
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
    await client.set(gameId, JSON.stringify(game));
    res.status(200).json(gameId);
  } catch (error) {
    throw new Error("Could not update db in initGame controller");
  }
});

export const updateGameState = asyncHandler(async (req, res) => {
  const { updatedGameState } = req.body;

  try {
    await client.set(updatedGameState.gameId, JSON.stringify(updatedGameState));
    res.status(200).json("Game updated successfully");
  } catch (error) {
    res.status(400);
    throw new Error("Could not update game state");
  }
});

export const deleteGameState = asyncHandler(async (req, res) => {
  const gameId = req.params.gameId;

  try {
    await client.del(gameId);
    res.status(200).json("Game state deleted");
  } catch (error) {
    res.status(400).json("Could not delete game state");
  }
});

export const getGameState = asyncHandler(async (req, res) => {
  const gameId = req.body.gameId;
  const gameData = await client.get(gameId);
  const gameState = JSON.parse(gameData);

  if (gameState) {
    res.status(200).json(gameState);
  }
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  try {
    let q =
      "SELECT  u.userId, u.userName, lb.wins FROM users u JOIN leaderboard lb ON u.userId=lb.userId ORDER BY lb.score DESC";

    let data = await query(q, []);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json("There was a problem fetching leaderboard");
  }
});
