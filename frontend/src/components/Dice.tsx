import classNames from "classnames";
import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { SoundContext } from "../context/SoundContext";
import { diceRoll } from "../constants/constants";
import { FaHandPointLeft } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

interface Props {
  index: number;
}

const Dice = ({ index }: Props) => {
  const {
    randomNum,
    handleDiceThrow,
    highlightedPawns,
    currentPlayerTurnIndex,
    players,
  } = useContext(GameContext);
  const { playSound } = useContext(SoundContext);
  const { loggedUserInfo } = useContext(AuthContext);

  const rollDiceHandler = () => {
    playSound(diceRoll);

    handleDiceThrow();
  };

  console.log(randomNum);

  const currentPlayerId = players[currentPlayerTurnIndex!].userId;

  return (
    <div className="relative">
      {currentPlayerTurnIndex === index && highlightedPawns.length === 0 && (
        <FaHandPointLeft
          size={40}
          className="absolute point-animation right-[-4rem] text-yellow-500"
        />
      )}

      <button
        disabled={
          highlightedPawns.length > 0 ||
          currentPlayerTurnIndex !== index ||
          (currentPlayerId !== null &&
            currentPlayerId !== loggedUserInfo?.userId)
        }
        onClick={rollDiceHandler}
        className={classNames(
          "relative h-[3rem] w-[3rem] shadow-[0_3px_10px_rgb(0,0,0,0.3)]"
        )}
      >
        <>
          {!randomNum && (
            <div className="flex items-center justify-center">
              <div>?</div>
            </div>
          )}

          {randomNum === 1 && (
            <div className="flex items-center justify-center">
              <div className="diceDot"></div>
            </div>
          )}

          {randomNum === 2 && (
            <div className="">
              <div className="absolute right-2 top-2 diceDot"></div>

              <div className="absolute left-2 bottom-2 diceDot"></div>
            </div>
          )}

          {randomNum === 3 && (
            <div className="flex items-center justify-center">
              <div className="absolute right-2 top-2 diceDot"></div>
              <div className="diceDot"></div>
              <div className="absolute left-2 bottom-2 diceDot"></div>
            </div>
          )}

          {randomNum === 4 && (
            <div>
              <div className="absolute right-2 top-2 diceDot"></div>
              <div className="absolute left-2 top-2 diceDot"></div>
              <div className="absolute right-2 bottom-2 diceDot"></div>
              <div className="absolute left-2 bottom-2 diceDot"></div>
            </div>
          )}

          {randomNum === 5 && (
            <div className="flex items-center justify-center">
              <div className="absolute right-2 top-2 diceDot"></div>
              <div className="absolute left-2 top-2 diceDot"></div>
              <div className="diceDot"></div>
              <div className="absolute right-2 bottom-2 diceDot"></div>
              <div className="absolute left-2 bottom-2 diceDot"></div>
            </div>
          )}

          {randomNum === 6 && (
            <div className="flex justify-between mx-2">
              <div className="flex flex-col space-y-1">
                <div className="diceDot"></div>
                <div className="diceDot"></div>
                <div className="diceDot"></div>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="diceDot"></div>
                <div className="diceDot"></div>
                <div className="diceDot"></div>
              </div>
            </div>
          )}
        </>
      </button>
    </div>
  );
};

export default Dice;
