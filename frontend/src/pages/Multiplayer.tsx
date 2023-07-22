import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { SoundContext } from "../context/SoundContext";
import classNames from "classnames";
import GameOver from "../modals/GameOver";
import Board from "./Board";
import { diceRoll } from "../constants/constants";
import { SocketContext } from "../context/SocketContext";
import { GameState } from "../types/types";

const Multiplayer = () => {
  const {
    handleDiceThrow,
    players,
    randomNum,
    currentPlayerTurnIndex,
    isGameOver,
    retrieveMultiplayerGameStats,
    updateGameState,
  } = useContext(GameContext);
  const { playSound } = useContext(SoundContext);
  const { socket } = useContext(SocketContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGameData = async () => {
      await retrieveMultiplayerGameStats();
      setIsLoading(false);
    };

    if (isLoading) {
      fetchGameData();
    }
  }, []);

  useEffect(() => {
    socket?.on("diceRolled", (gameState: GameState) => {
      updateGameState(gameState);
    });

    return () => {
      socket?.off("diceRolled");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("playerMoved", (gameState: GameState) => {
      updateGameState(gameState);
    });

    return () => {
      socket?.off("playerMoved");
    };
  }, [socket]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <section className="flex items-center justify-center h-[100vh]">
      <span className="fixed top-2">{`player turn ${
        players[currentPlayerTurnIndex!].userName
      }`}</span>

      <span className="fixed text-2xl text-blue-500">{randomNum}</span>
      <div className="relative flex justify-center items-center h-[700px]">
        {players.map((player, index) => (
          <div
            key={player.color}
            className={classNames("", {
              "absolute top-0 left-0": player.color === "red",
              "absolute top-0 right-0": player.color === "green",
              "absolute bottom-0 left-0": player.color === "blue",
              "absolute bottom-0 right-0": player.color === "yellow",
            })}
          >
            <div className="">{`player ${player.userName}`}</div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  playSound(diceRoll);
                  handleDiceThrow();
                }}
                className="p-2 text-white bg-red-500 hover:bg-red-400 disabled:bg-gray-400"
              >
                Throw
              </button>
            </div>
          </div>
        ))}

        <Board />
      </div>
      {isGameOver && <GameOver />}
    </section>
  );
};

export default Multiplayer;
