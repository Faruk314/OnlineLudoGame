import classNames from "classnames";
import React, { useContext, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import { SoundContext } from "../context/SoundContext";
import GameOver from "../modals/GameOver";
import Board from "./Board";
import { diceRoll } from "../constants/constants";
import SoundButton from "../components/SoundButton";
import Exit from "../components/Exit";

const SinglePlayer = () => {
  const {
    handleDiceThrow,
    players,
    randomNum,
    currentPlayerTurnIndex,
    isGameOver,
    retrieveGameStatus,
    highlightedPawns,
  } = useContext(GameContext);
  const { playSound } = useContext(SoundContext);

  useEffect(() => {
    retrieveGameStatus();
  }, []);

  return (
    <section className="flex items-center justify-center h-[100vh]">
      <div className="fixed top-0 flex justify-end w-full p-2">
        <div className="flex items-center space-x-2">
          <SoundButton />
          <Exit />
        </div>

        <span className="fixed top-5 left-[47%]">{`player ${
          currentPlayerTurnIndex! + 1
        } turn`}</span>
      </div>
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
                disabled={
                  currentPlayerTurnIndex !== index ||
                  highlightedPawns.length > 0
                    ? true
                    : false
                }
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

export default SinglePlayer;
