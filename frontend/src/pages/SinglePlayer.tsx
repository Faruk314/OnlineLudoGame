import React, { useEffect, useState } from "react";
import Board from "./Board";

const SinglePlayer = () => {
  const [randomNum, setRandomNum] = useState<null | number>(null);

  useEffect(() => {
    const initGame = () => {};

    initGame();
  }, []);

  const throwDice = () => {
    const randomNum = Math.floor(Math.random() * 6 + 1);

    setRandomNum(randomNum);
  };

  return (
    <section>
      <div className="absolute flex space-x-4 items-center bottom-10 left-10">
        <button
          onClick={() => throwDice()}
          className=" bg-blue-500 text-white p-2 rounded-md hover:bg-blue-400"
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
