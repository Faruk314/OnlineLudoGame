import React, { useEffect, useState } from "react";
import Board from "./Board";
import { IPlayer } from "../types/types";
import {
  redZone,
  greenZone,
  yellowZone,
  blueZone,
  path,
} from "../constants/constants";

export class Player {
  color: null | string = null;
  pawnOnePosition: number | null = null;
  pawnTwoPosition: number | null = null;
  pawnThreePosition: number | null = null;
  pawnFourPosition: number | null = null;

  constructor({ color }: IPlayer) {
    if (!this.color) {
      this.color = color;

      switch (color) {
        case "red":
          this.pawnOnePosition = redZone.playerZones[0];
          this.pawnTwoPosition = redZone.playerZones[1];
          this.pawnThreePosition = redZone.playerZones[2];
          this.pawnFourPosition = redZone.playerZones[3];
          break;
        case "green":
          this.pawnOnePosition = 42;
          this.pawnTwoPosition = 43;
          this.pawnThreePosition = 57;
          this.pawnFourPosition = 58;
          break;
        case "blue":
          this.pawnOnePosition = 168;
          this.pawnTwoPosition = 169;
          this.pawnThreePosition = 183;
          this.pawnFourPosition = 184;
          break;
        default:
          this.pawnOnePosition = 177;
          this.pawnTwoPosition = 178;
          this.pawnThreePosition = 192;
          this.pawnFourPosition = 193;
          break;
      }
    }
  }
}

const SinglePlayer = () => {
  const [randomNum, setRandomNum] = useState<null | number>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState("");
  const [highlightedPawns, setHighlightedPawns] = useState<number[]>([]);

  console.log(players);

  const higlightStartingPawns = (
    currentPlayerIndex: number,
    playerZones: number[]
  ) => {
    const pawnOnePosition = players[currentPlayerIndex].pawnOnePosition;
    const pawnTwoPosition = players[currentPlayerIndex].pawnTwoPosition;
    const pawnThreePosition = players[currentPlayerIndex].pawnThreePosition;
    const pawnFourPosition = players[currentPlayerIndex].pawnFourPosition;

    const pawnOneStartingPosition = playerZones[0];
    const pawnTwoStartingPosition = playerZones[1];
    const pawnThreeStartingPosition = playerZones[2];
    const pawnFourStartingPosition = playerZones[3];

    const highlighted: number[] = [];

    if (pawnOnePosition === pawnOneStartingPosition) {
      highlighted.push(pawnOnePosition);
    }

    if (pawnTwoPosition === pawnTwoStartingPosition) {
      highlighted.push(pawnTwoPosition);
    }

    if (pawnThreePosition === pawnThreeStartingPosition) {
      highlighted.push(pawnThreePosition);
    }

    if (pawnFourPosition === pawnFourStartingPosition) {
      highlighted.push(pawnFourPosition);
    }

    return highlighted;
  };

  const handleDiceThrow = () => {
    const randomNum = Math.floor(Math.random() * 6 + 1);
    let currentPlayerZone: number[] = [];
    let currentPlayerIndex = players.findIndex(
      (player) => player.color === currentPlayerTurn
    );

    if (currentPlayerTurn === "red") {
      currentPlayerZone = redZone.playerZones;
    }
    if (currentPlayerTurn === "blue") {
      currentPlayerZone = blueZone.playerZones;
    }

    if (currentPlayerTurn === "green") {
      currentPlayerZone = greenZone.playerZones;
    }

    if (currentPlayerTurn === "yellow") {
      currentPlayerZone = yellowZone.playerZones;
    }

    if (randomNum === 6) {
      const highlighted = higlightStartingPawns(
        currentPlayerIndex,
        currentPlayerZone
      );

      setHighlightedPawns((prev) => [...prev, ...highlighted]);
      console.log(highlighted);
    }

    // const currentPlayerIndex = players.findIndex(
    //   (player) => player.color === currentPlayerTurn
    // );

    // players[currentPlayerIndex] =

    setRandomNum(randomNum);
  };

  useEffect(() => {
    const initGame = () => {
      const player = new Player({ color: "red" });
      const computer = new Player({ color: "blue" });

      setCurrentPlayerTurn("red");
      setPlayers([player, computer]);
    };

    initGame();
  }, []);

  return (
    <section>
      <div className="absolute flex items-center space-x-4 bottom-10 left-10">
        <button
          onClick={() => handleDiceThrow()}
          className="p-2 text-white bg-blue-500 rounded-md hover:bg-blue-400"
        >
          Throw
        </button>

        <span className="text-2xl">{randomNum}</span>
      </div>

      <Board players={players} currentPlayerTurn={currentPlayerTurn} />
    </section>
  );
};

export default SinglePlayer;
