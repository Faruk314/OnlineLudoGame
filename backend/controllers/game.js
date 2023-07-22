import asyncHandler from "express-async-handler";
import { client } from "../app.js";
import { Player } from "../utils/Player.js";
import query from "../db.js";

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

export const getMultiplayerGameState = asyncHandler(async (req, res) => {
  const userId = 2;

  //retrieve gameId
  let q =
    "SELECT `gameId` FROM games WHERE `playerOne` = ? OR `playerTwo` = ? OR `playerThree` = ? OR `playerFour` = ?";

  let data = await query(q, [userId, userId, userId, userId]);

  //this will retrieve ids for all players in that specific game
  q = `SELECT g.playerOne, g.playerTwo, g.playerThree, g.playerFour FROM games g WHERE g.gameId = ?`;

  let playersIds = await query(q, [data[0].gameId]);

  let playersData = [];

  for (let i = 0; i < Object.values(playersIds[0]).length; i++) {
    let playerId = Object.values(playersIds[0]);

    if (playerId[i] !== null) {
      let playerInfoQuery =
        "SELECT u.userName, u.userId FROM users u WHERE u.userId = ?";
      let playerData = await query(playerInfoQuery, [playerId[i]]);

      playersData.push(playerData[0]);
    }
  }

  const gameData = await client.get(data[0].gameId);
  const gameState = JSON.parse(gameData);

  gameState.players.forEach((player, index) => {
    if (playersData[index].userId === player.userId) {
      player.userName = playersData[index].userName;
    }
  });

  await client.set(data[0].gameId, JSON.stringify(gameState));

  res.json({
    gameState,
    gameId: data[0].gameId,
  });
});
