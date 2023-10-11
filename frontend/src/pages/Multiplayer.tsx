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
import SoundButton from "../components/SoundButton";
import Exit from "../components/Exit";
import Dice from "../components/Dice";

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
  }, [isLoading]);

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
    <section className="flex items-center justify-center h-[100vh] z-20">
      <div className="fixed top-0 flex justify-between w-full p-2">
        <div></div>

        <div className="flex items-center space-x-2">
          <SoundButton />
          <Exit />
        </div>
      </div>

      <div className="relative flex justify-center items-center h-[700px]">
        {players.map((player, index) => (
          <div
            key={player.color}
            className={classNames("flex flex-col items-center", {
              "absolute top-0 md:top-[-3rem] lg:top-[-2rem] left-0":
                player.color === "red",
              "absolute top-0 md:top-[-3rem] lg:top-[-5rem] right-0":
                player.color === "green",
              "absolute bottom-0 md:bottom-[-3rem] lg:bottom-[-2rem] left-0":
                player.color === "blue",
              "absolute bottom-0 md:bottom-[-3rem] lg:bottom-[-2rem] right-0":
                player.color === "yellow",
            })}
          >
            <div className="flex items-center h-20 space-x-4 rounded-md">
              <div className="flex flex-col items-center">
                <div className="border-2 border-black rounded-md">
                  <img
                    src={avatars[player.image!]}
                    alt=""
                    className="h-[5rem] p-1"
                  />
                </div>

                <span className="">{player.userName}</span>
              </div>

              <Dice index={index} />
            </div>

            {/* {players[currentPlayerTurnIndex!].userId ===
              loggedUserInfo?.userId &&
              currentPlayerTurnIndex === index && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      playSound(diceRoll);
                      handleDiceThrow();
                    }}
                    className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-gray-400"
                  >
                    Throw
                  </button>
                </div>
              )} */}
          </div>
        ))}

        <Board />
      </div>
      {isGameOver && <GameOver />}
    </section>
  );
};

export default Multiplayer;
