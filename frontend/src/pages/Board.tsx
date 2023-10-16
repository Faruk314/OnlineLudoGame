import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import {
  redZone,
  greenZone,
  yellowZone,
  blueZone,
  path,
  safeZones,
} from "../constants/constants";
import { GameContext } from "../context/GameContext";
import { AiFillStar } from "react-icons/ai";
import redPawn from "../assets/images/redPawn.png";
import yellowPawn from "../assets/images/yellowPawn.png";
import greenPawn from "../assets/images/greenPawn.png";
import bluePawn from "../assets/images/bluePawn.png";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const Board = () => {
  const [cells, setCells] = useState<number[]>([]);
  const {
    players,
    highlightedPawns,
    handlePlayerMove,
    currentPlayerTurnIndex,
    gameId,
  } = useContext(GameContext);
  const { loggedUserInfo } = useContext(AuthContext);

  useEffect(() => {
    const createGrid = () => {
      let cells: number[] = [];

      for (let i = 0; i < 225; i++) {
        cells.push(i);
      }

      setCells(cells);
    };

    createGrid();
  }, []);

  let pawns: any = [];

  players.forEach((player) => {
    const pawnPositions = player.pawnPositions;
    const color = player.color;

    pawnPositions.forEach((pawnPosition) =>
      pawns.push({ color, pawnPosition })
    );
  });

  return (
    <div className="board">
      {cells.map((cell, index) => {
        const isSafeZone = safeZones.includes(cell + 1);

        let isEnemyTurn = false;

        if (currentPlayerTurnIndex && players[currentPlayerTurnIndex].userId) {
          if (
            players[currentPlayerTurnIndex!].userId !== loggedUserInfo?.userId
          )
            isEnemyTurn = true;
        }

        return (
          <div
            key={cell}
            className={classNames(
              "relative flex items-center justify-center z-0",
              {
                "border border-gray-300": path.includes(cell + 1),
                "bg-red-600 rounded-full border-none mb-1 mx-1":
                  redZone.playerZones.includes(cell + 1),
                "bg-red-600 border-none": redZone.border.includes(cell + 1),
                "bg-red-600 border": redZone.finalZones.includes(cell + 1),
                "bg-green-600 border-none": greenZone.border.includes(cell + 1),
                "bg-green-600 rounded-full mb-1 mx-1":
                  greenZone.playerZones.includes(cell + 1),
                "bg-green-600 border": greenZone.finalZones.includes(cell + 1),
                "bg-blue-600 border-none": blueZone.border.includes(cell + 1),
                "bg-blue-600 rounded-full mb-1 mx-1":
                  blueZone.playerZones.includes(cell + 1),
                "bg-blue-600 border": blueZone.finalZones.includes(cell + 1),
                "bg-yellow-400 border-none": yellowZone.border.includes(
                  cell + 1
                ),
                "bg-yellow-400 rounded-full mb-1 mx-1":
                  yellowZone.playerZones.includes(cell + 1),
                "bg-yellow-400 border": yellowZone.finalZones.includes(
                  cell + 1
                ),
              }
            )}
          >
            {isSafeZone && (
              <AiFillStar className="absolute text-gray-300 md:text-2xl" />
            )}

            <div className="absolute grid grid-cols-2">
              {pawns.map((pawn: any, index: number) => {
                let isHighlighted = highlightedPawns.includes(
                  pawn.pawnPosition
                );
                const currentPlayerColor =
                  players[currentPlayerTurnIndex!].color;

                if (pawn.pawnPosition === cell + 1) {
                  return (
                    <div
                      key={index}
                      onClick={() =>
                        isHighlighted &&
                        !isEnemyTurn &&
                        handlePlayerMove(cell + 1)
                      }
                      className={classNames("cursor-pointer  z-20", {})}
                    >
                      {pawn.color === "red" && (
                        <img
                          className={classNames("pawn-image", {
                            "border-2 border-black rounded-full":
                              isHighlighted &&
                              !isEnemyTurn &&
                              currentPlayerColor === "red",
                          })}
                          src={redPawn}
                          alt=""
                        />
                      )}
                      {pawn.color === "yellow" && (
                        <img
                          className={classNames("pawn-image", {
                            "border-2 border-black rounded-full":
                              isHighlighted &&
                              !isEnemyTurn &&
                              currentPlayerColor === "yellow",
                          })}
                          src={yellowPawn}
                          alt=""
                        />
                      )}
                      {pawn.color === "blue" && (
                        <img
                          className={classNames("pawn-image", {
                            "border-2 border-black rounded-full":
                              isHighlighted &&
                              !isEnemyTurn &&
                              currentPlayerColor === "blue",
                          })}
                          src={bluePawn}
                          alt=""
                        />
                      )}
                      {pawn.color === "green" && (
                        <img
                          className={classNames("pawn-image", {
                            "border-2 border-black rounded-full":
                              isHighlighted &&
                              !isEnemyTurn &&
                              currentPlayerColor === "green",
                          })}
                          src={greenPawn}
                          alt=""
                        />
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* <div
              onClick={() =>
                isHighlighted && !isEnemyTurn && handlePlayerMove(cell + 1)
              }
              className={classNames(
                "absolute top-[-0.5rem] md:top-[-1rem] cursor-pointer z-20",
                {
                  "border-2 border-black rounded-full":
                    isHighlighted && !isEnemyTurn,
                }
              )}
            >
              {pawn?.color === "red" && (
                <img
                  className="h-[1.5rem] md:h-[2.5rem]"
                  src={redPawn}
                  alt=""
                />
              )}
              {pawn?.color === "yellow" && (
                <img
                  className="h-[1.5rem] md:h-[2.5rem]"
                  src={yellowPawn}
                  alt=""
                />
              )}
              {pawn?.color === "blue" && (
                <img
                  className="h-[1.5rem] md:h-[2.5rem]"
                  src={bluePawn}
                  alt=""
                />
              )}
              {pawn?.color === "green" && (
                <img
                  className=" h-[1.5rem] md:h-[2.5rem]"
                  src={greenPawn}
                  alt=""
                />
              )}
            </div> */}

            {/* {cell + 1} */}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
