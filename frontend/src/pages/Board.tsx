import classNames from "classnames";
import React, { useEffect, useState } from "react";

const Board = () => {
  const [cells, setCells] = useState<number[]>([]);

  const redZone = {
    startingPoint: 1,
    border: [
      1, 2, 3, 4, 5, 6, 16, 21, 31, 36, 46, 51, 61, 66, 76, 81, 77, 78, 79, 80,
    ],
    playerZones: [33, 34, 48, 49],
    finalZones: [],
  };

  const greenZone = {
    startingPoint: 1,
    border: [
      10, 11, 12, 13, 14, 15, 25, 30, 40, 45, 55, 60, 70, 75, 85, 86, 87, 88,
      89, 90,
    ],
    playerZones: [42, 43, 57, 58],
    finalZones: [],
  };

  const blueZone = {
    startingPoint: 1,
    border: [
      136, 137, 138, 139, 140, 141, 151, 156, 166, 171, 181, 186, 196, 201, 211,
      212, 213, 214, 215, 216,
    ],
    playerZones: [168, 169, 183, 184],
    finalZones: [],
  };

  const yellowZone = {
    startingPoint: 1,
    border: [
      145, 146, 147, 148, 149, 150, 160, 165, 175, 180, 190, 195, 205, 210, 220,
      221, 222, 223, 224, 225,
    ],
    playerZones: [177, 178, 192, 193],
    finalZones: [],
  };

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
            className={classNames("border", {
              "bg-red-500 rounded-full border-none":
                redZone.playerZones.includes(cell + 1),
              "bg-red-500 border-none": redZone.border.includes(cell + 1),
              "bg-green-600 border-none": greenZone.border.includes(cell + 1),
              "bg-green-600 rounded-full": greenZone.playerZones.includes(
                cell + 1
              ),
              "bg-blue-600 border-none": blueZone.border.includes(cell + 1),
              "bg-blue-600 rounded-full": blueZone.playerZones.includes(
                cell + 1
              ),
              "bg-yellow-400 border-none": yellowZone.border.includes(cell + 1),
              "bg-yellow-400 rounded-full": yellowZone.playerZones.includes(
                cell + 1
              ),
            })}
          >
            {cell + 1}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Board;
