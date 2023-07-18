import classNames from "classnames";
import React, { useContext, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import { SoundContext } from "../context/SoundContext";
import GameOver from "../modals/GameOver";
import Board from "./Board";
import { diceRoll } from "../constants/constants";

const SinglePlayer = () => {
  const {
    handleDiceThrow,
    players,
    randomNum,
    initGame,
    currentPlayerTurnIndex,
    playerTurns,
    isGameOver,
    retrieveGameStatus,
  } = useContext(GameContext);
  const { playSound } = useContext(SoundContext);

  useEffect(() => {
    retrieveGameStatus();
  }, []);
  console.log(players);

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
            <div className="">{`player ${index + 1}`}</div>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentPlayerTurnIndex === index ? false : true}
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

export default SinglePlayer;
