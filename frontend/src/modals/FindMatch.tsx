import React, { useContext, useState } from "react";
import { GameContext } from "../context/GameContext";
import classNames from "classnames";
import { SoundContext } from "../context/SoundContext";
import { onChangeSound } from "../constants/constants";

interface Props {
  setOpenFindMatch: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindMatch = ({ setOpenFindMatch }: Props) => {
  const [findingMatch, setFindingMatch] = useState(false);
  const { chosenPlayers, setChosenPlayers } = useContext(GameContext);
  const { playSound } = useContext(SoundContext);

  console.log(chosenPlayers);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative z-40 flex flex-col items-center justify-center px-[3rem] md:px-0 md:w-[20rem] py-3 mx-2 space-y-4 bg-white rounded-md shadow-xl">
        {!findingMatch && (
          <>
            <button
              onClick={() => {
                setChosenPlayers(0);
                setOpenFindMatch(false);
              }}
              className="flex absolute top-2 right-2 items-center border border-black hover:bg-red-600 justify-center w-[2rem] h-[2rem]  text-white bg-red-500 rounded-md"
            >
              X
            </button>
            <div className="grid grid-cols-2 gap-5 pt-5">
              <button
                onClick={() => {
                  playSound(onChangeSound);
                  setChosenPlayers(2);
                }}
                className={classNames(
                  "shadow-[0_3px_10px_rgb(0,0,0,0.2)] h-[5rem] md:h-[6.5rem] px-2 md:px-5 flex flex-col justify-center items-center rounded-lg hover:bg-gray-100",
                  {
                    "border-2 border-red-400": chosenPlayers === 2,
                  }
                )}
              >
                <span>2</span>
                <span>players</span>
              </button>

              <button
                onClick={() => {
                  playSound(onChangeSound);
                  setChosenPlayers(4);
                }}
                className={classNames(
                  "shadow-[0_3px_10px_rgb(0,0,0,0.2)] h-[5rem] md:h-[6.5rem] px-2 md:px-5 flex flex-col justify-center items-center rounded-lg hover:bg-gray-100",
                  {
                    "border-2 border-red-400": chosenPlayers === 4,
                  }
                )}
              >
                <span>4</span>
                <span>players</span>
              </button>
            </div>

            <button
              disabled={chosenPlayers === 0 ? true : false}
              onClick={() => {
                setFindingMatch(true);
              }}
              className="px-3 py-2 font-bold text-white bg-red-500 border border-black rounded-lg disabled:bg-gray-400 hover:bg-red-600 disabled:text-gray-200"
            >
              Continue
            </button>
          </>
        )}

        {findingMatch && (
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-xl">Finding match...</h2>
            <div className="loader"></div>

            <button
              onClick={() => {
                setFindingMatch(false);
                setChosenPlayers(0);
              }}
              className="px-3 py-1 font-bold text-white bg-red-500 border border-black rounded-lg disabled:bg-gray-400 hover:bg-red-600 disabled:text-gray-200"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindMatch;
