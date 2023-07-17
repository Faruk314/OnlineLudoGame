import classNames from "classnames";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import { clickSound, onChangeSound, pawns } from "../constants/constants";
import { SoundContext } from "../context/SoundContext";

interface Props {
  setShowChoseColors: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChoseColors = ({ setShowChoseColors }: Props) => {
  const navigate = useNavigate();
  const { playSound } = useContext(SoundContext);
  const { chosenPlayers, setChosenPlayers, setChosenColors, chosenColors } =
    useContext(GameContext);

  const pickColorHandler = (color: string) => {
    playSound(onChangeSound);

    if (chosenColors.includes(color)) {
      return setChosenColors(chosenColors.filter((item) => item !== color));
    }

    if (chosenColors.length === chosenPlayers) return;

    if (!chosenColors.includes(color)) {
      setChosenColors((prev) => [...prev, color]);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative z-40 flex flex-col items-center justify-center px-[3rem] py-3 mx-2 space-y-4 bg-white rounded-md shadow-xl">
        <button
          onClick={() => {
            setChosenPlayers(0);
            setChosenColors([]);
            setShowChoseColors(false);
          }}
          className="flex absolute top-2 right-2 items-center border border-black hover:bg-red-600 justify-center w-[2rem] h-[2rem]  text-white bg-red-500 rounded-md"
        >
          X
        </button>

        <h2 className="text-xl">{`choose ${chosenPlayers} colors`}</h2>

        <div className="grid grid-cols-2 gap-5 p-4">
          {pawns.map((pawn, index) => (
            <button
              key={index}
              onClick={() => pickColorHandler(pawn.color)}
              className={classNames(
                "shadow-[0_3px_10px_rgb(0,0,0,0.2)] py-4 px-6 rounded-lg hover:bg-gray-100",
                {
                  "border-2 border-red-400": chosenColors.includes(pawn.color),
                }
              )}
            >
              <img
                className={classNames("mx-auto", {
                  "w-8": pawn.color === "yellow",
                })}
                src={pawn.url}
                alt=""
              />
            </button>
          ))}
        </div>

        <button
          disabled={chosenColors.length !== chosenPlayers ? true : false}
          onClick={() => {
            playSound(clickSound);
            setShowChoseColors(true);
            navigate("/local");
          }}
          className="px-5 py-2 font-bold text-white bg-red-500 border border-black rounded-lg disabled:bg-gray-400 hover:bg-red-600 disabled:text-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ChoseColors;
