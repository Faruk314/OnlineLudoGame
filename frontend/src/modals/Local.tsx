import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import { SoundContext } from "../context/SoundContext";
import ChoseColors from "./ChoseColors";
import { onChangeSound, clickSound } from "../constants/constants";

interface Props {
  setOpenLocal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Local = ({ setOpenLocal }: Props) => {
  const { setChosenPlayers, chosenPlayers, initGame } = useContext(GameContext);
  const [showChoseColors, setShowChoseColors] = useState(false);
  const navigate = useNavigate();
  const { playSound } = useContext(SoundContext);

  const changeHandler = (e: any) => {
    playSound(onChangeSound);
    setChosenPlayers(parseInt(e.target.value));
  };

  const handleClick = async () => {
    playSound(clickSound);

    if (chosenPlayers === 4) {
      const gameId = await initGame();

      if (gameId) {
        navigate(`/local/${gameId}`);
        return;
      }
    }

    setShowChoseColors(true);
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      {!showChoseColors && (
        <div className="relative z-40 flex flex-col items-center justify-center px-[3rem] py-3 mx-2 space-y-4 bg-white rounded-md shadow-xl">
          <button
            onClick={() => {
              setChosenPlayers(0);
              setOpenLocal(false);
            }}
            className="flex absolute top-2 right-2 items-center border border-black hover:bg-red-600 justify-center w-[2rem] h-[2rem]  text-white bg-red-500 rounded-md"
          >
            X
          </button>

          <div className="flex flex-col py-6 space-y-2">
            <div className="flex items-center space-x-2 text-2xl">
              <input
                onChange={changeHandler}
                className="w-4 h-4 border border-black rounded-full appearance-none cursor-pointer checked:bg-red-500"
                type="radio"
                id="2"
                name="player"
                value={2}
              />
              <label htmlFor="easy">Two players</label>
            </div>

            <div className="flex items-center space-x-2 text-2xl">
              <input
                onChange={changeHandler}
                className="w-4 h-4 border border-black rounded-full appearance-none cursor-pointer checked:bg-red-500"
                type="radio"
                id="3"
                name="player"
                value={3}
              />
              <label htmlFor="hard">Three players</label>
            </div>

            <div className="flex items-center space-x-2 text-2xl">
              <input
                onChange={changeHandler}
                className="w-4 h-4 border border-black rounded-full appearance-none cursor-pointer checked:bg-red-500"
                type="radio"
                id="4"
                name="player"
                value={4}
              />
              <label htmlFor="hard">Four players</label>
            </div>
          </div>

          <button
            disabled={chosenPlayers === 0 ? true : false}
            onClick={handleClick}
            className="px-5 py-2 font-bold text-white bg-red-500 border border-black rounded-lg disabled:bg-gray-400 hover:bg-red-600 disabled:text-gray-200"
          >
            Continue
          </button>
        </div>
      )}

      {showChoseColors && (
        <ChoseColors setShowChoseColors={setShowChoseColors} />
      )}
    </div>
  );
};

export default Local;
