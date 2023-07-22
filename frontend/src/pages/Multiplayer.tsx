import React, { useEffect } from "react";
import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { SoundContext } from "../context/SoundContext";
import classNames from "classnames";
import GameOver from "../modals/GameOver";
import Board from "./Board";
import { diceRoll } from "../constants/constants";
import { AuthContext } from "../context/AuthContext";

const Multiplayer = () => {
  const {
    handleDiceThrow,
    players,
    randomNum,
    currentPlayerTurnIndex,
    isGameOver,
    highlightedPawns,
    retrieveMultiplayerGameStats,
  } = useContext(GameContext);
  const { playSound } = useContext(SoundContext);
  const { loggedUserInfo } = useContext(AuthContext);

  useEffect(() => {
    retrieveMultiplayerGameStats();
  }, []);

  return (
    <section className="flex items-center justify-center h-[100vh]">
      <span className="fixed top-2">{`player turn ${
        currentPlayerTurnIndex! + 1
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
                disabled={
                  players[currentPlayerTurnIndex!].userId !==
                    loggedUserInfo?.userId ||
                  highlightedPawns.length > 0 ||
                  currentPlayerTurnIndex === index
                    ? true
                    : false
                }
                onClick={() => {
                  playSound(diceRoll);
                  handleDiceThrow();
                }}
                className="p-2 text-white bg-blue-500 hover:bg-blue-400 disabled:bg-gray-400"
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
