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
import custom from "../assets/images/custom.png";
import custom1 from "../assets/images/custom1.png";
import custom2 from "../assets/images/custom2.png";
import custom3 from "../assets/images/custom3.png";
import custom4 from "../assets/images/custom4.png";
import custom5 from "../assets/images/custom.png";
import { AuthContext } from "../context/AuthContext";

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
  const avatars = [custom, custom1, custom2, custom3, custom4, custom5];
  const { loggedUserInfo } = useContext(AuthContext);

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
            className={classNames("flex flex-col items-center", {
              "absolute top-0 md:top-[-3rem] lg:top-[-5rem] left-0":
                player.color === "red",
              "absolute top-0 md:top-[-3rem] lg:top-[-5rem] right-0":
                player.color === "green",
              "absolute bottom-0 md:bottom-[-3rem] lg:bottom-[-5rem] left-0":
                player.color === "blue",
              "absolute bottom-0 md:bottom-[-3rem] lg:bottom-[-5rem] right-0":
                player.color === "yellow",
            })}
          >
            <div className="flex items-center justify-center h-20 border border-black rounded-md">
              <img src={avatars[player.image!]} alt="" className="h-full p-1" />
            </div>

            <div className="">{player.userName}</div>

            {players[currentPlayerTurnIndex!].userId ===
              loggedUserInfo?.userId &&
              currentPlayerTurnIndex === index && (
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
              )}
          </div>
        ))}

        <Board />
      </div>
      {isGameOver && <GameOver />}
    </section>
  );
};

export default Multiplayer;
