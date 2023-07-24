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

const Board = () => {
  const [cells, setCells] = useState<number[]>([]);
  const { players, highlightedPawns, handlePlayerMove } =
    useContext(GameContext);

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

  return (
    <div className="board">
      {cells.map((cell, index) => {
        const pawn = players.find((player) =>
          player.pawnPositions.includes(cell + 1)
        );

        const isHighlighted = highlightedPawns.includes(cell + 1);

        const isSafeZone = safeZones.includes(cell + 1);

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

            <div className="absolute">
              {pawn && (
                <div
                  onClick={() => isHighlighted && handlePlayerMove(cell + 1)}
                  className={classNames(
                    "pawnSize border border-black rounded-full",
                    {
                      "bg-red-400": pawn?.color === "red",
                      "bg-blue-400": pawn?.color === "blue",
                      "bg-green-400": pawn?.color === "green",
                      "bg-yellow-400": pawn?.color === "yellow",
                      "border-4 border-black cursor-pointer": isHighlighted,
                    }
                  )}
                ></div>
              )}
            </div>

            {/* {cell + 1} */}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
