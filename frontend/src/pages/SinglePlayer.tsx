import React, { useEffect, useState } from "react";
import Board from "./Board";
import { IPlayer } from "../types/types";

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
          this.pawnOnePosition = 33;
          this.pawnTwoPosition = 34;
          this.pawnThreePosition = 48;
          this.pawnFourPosition = 49;
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

  console.log(players);

  const handleDiceThrow = () => {
    const randomNum = Math.floor(Math.random() * 6 + 1);

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
