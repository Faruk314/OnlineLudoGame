import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";

const GameOver = () => {
  const { currentPlayerTurnIndex, players, setGameOver } =
    useContext(GameContext);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgb(0,0,0,0.7)]">
      <div className="flex flex-col items-center w-[10rem] p-2 mx-2 bg-white rounded-md">
        <span>Game Over</span>
        <h2 className="text-xl text-center">{`${
          players[currentPlayerTurnIndex!].color
        } won`}</h2>

        <div className="grid items-center grid-cols-4 py-5 space-x-1"></div>

        <button
          onClick={() => {
            setGameOver(false);
          }}
          className="px-2 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Continiue
        </button>
      </div>
    </div>
  );
};

export default GameOver;
