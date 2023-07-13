import React, { useContext, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import Board from "./Board";

const SinglePlayer = () => {
  const { handleDiceThrow, players, randomNum, initGame } =
    useContext(GameContext);

  useEffect(() => {
    initGame();
  }, []);
  console.log(players);

  return (
    <section>
      <div className="absolute flex items-center space-x-4 bottom-10 left-10">
        <button
          onClick={() => handleDiceThrow()}
          className="p-2 text-white bg-blue-500 rounded-md hover:bg-blue-400"
        >
          Throw
        </button>

        <span className="text-2xl">{randomNum}</span>
      </div>

      <Board />
    </section>
  );
};

export default SinglePlayer;
