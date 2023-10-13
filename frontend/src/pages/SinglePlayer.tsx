import classNames from "classnames";
import React, { useContext, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import { SoundContext } from "../context/SoundContext";
import GameOver from "../modals/GameOver";
import Board from "./Board";
import SoundButton from "../components/SoundButton";
import Exit from "../components/Exit";
import Dice from "../components/Dice";
import redPawn from "../assets/images/redPawn.png";
import yellowPawn from "../assets/images/yellowPawn.png";
import greenPawn from "../assets/images/greenPawn.png";
import bluePawn from "../assets/images/bluePawn.png";

const SinglePlayer = () => {
  const {
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
      </div>

      <div className="relative flex justify-center items-center h-[700px]">
        {players.map((player, index) => {
          const red = player.color === "red";
          const green = player.color === "green";
          const blue = player.color === "blue";
          const yellow = player.color === "yellow";

          return (
            <div
              key={player.color}
              className={classNames("flex items-center space-x-4", {
                "absolute top-[-1.5rem] left-0": red,
                "absolute top-[-1.5rem] right-0": green,
                "absolute bottom-[-1.5rem] left-0": blue,
                "absolute bottom-[-1.5rem] right-0": yellow,
              })}
            >
              {red && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center px-5 py-3 bg-gray-100 border border-black rounded-md">
                    <img src={redPawn} alt="" />
                  </div>
                  <Dice index={index} />
                </div>
              )}

              {yellow && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center px-5 py-2 bg-gray-100 border border-black rounded-md">
                    <img
                      className="h-[3rem] w-[1.5rem]"
                      src={yellowPawn}
                      alt=""
                    />
                  </div>
                  <Dice index={index} />
                </div>
              )}

              {green && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center px-5 py-3 bg-gray-100 border border-black rounded-md">
                    <img className="" src={greenPawn} alt="" />
                  </div>
                  <Dice index={index} />
                </div>
              )}

              {blue && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center px-5 py-3 bg-gray-100 border border-black rounded-md">
                    <img className="" src={bluePawn} alt="" />
                  </div>
                  <Dice index={index} />
                </div>
              )}
            </div>
          );
        })}

        <Board />
      </div>
      {isGameOver && <GameOver />}
    </section>
  );
};

export default SinglePlayer;
