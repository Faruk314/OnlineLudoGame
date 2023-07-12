import classNames from "classnames";
import React, { useEffect, useState } from "react";
import {
  redZone,
  greenZone,
  yellowZone,
  blueZone,
  path,
} from "../constants/constants";

const Board = () => {
  const [cells, setCells] = useState<number[]>([]);

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
    <section className="grid justify-center h-[100vh] items-center">
      <div className="board w-[700px] h-[700px]">
        {cells.map((cell) => (
          <div
            key={cell}
            className={classNames("", {
              "border border-black": path.includes(cell + 1),
              "bg-red-500 rounded-full border-none":
                redZone.playerZones.includes(cell + 1),

              "bg-red-500 border-none": redZone.border.includes(cell + 1),
              "bg-red-500 border border-black": redZone.finalZones.includes(
                cell + 1
              ),
              "bg-green-600 border-none": greenZone.border.includes(cell + 1),
              "bg-green-600 rounded-full": greenZone.playerZones.includes(
                cell + 1
              ),
              "bg-green-600 border border-black": greenZone.finalZones.includes(
                cell + 1
              ),
              "bg-blue-600 border-none": blueZone.border.includes(cell + 1),
              "bg-blue-600 rounded-full": blueZone.playerZones.includes(
                cell + 1
              ),
              "bg-blue-600 border border-black": blueZone.finalZones.includes(
                cell + 1
              ),
              "bg-yellow-400 border-none": yellowZone.border.includes(cell + 1),
              "bg-yellow-400 rounded-full": yellowZone.playerZones.includes(
                cell + 1
              ),
              "bg-yellow-400 border border-black":
                yellowZone.finalZones.includes(cell + 1),
            })}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Board;
