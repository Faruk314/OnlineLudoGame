import React, { createContext, useState, useCallback } from "react";
import { Player } from "../classess/Player";
import {
  redZone,
  blueZone,
  yellowZone,
  greenZone,
} from "../constants/constants";

interface GameContextProps {
  randomNum: null | number;
  players: Player[];
  currentPlayerTurn: string;
  highlightedPawns: number[];
  initGame: () => void;
  higlightStartingPawns: (
    currentPlayerIndex: number,
    playerZones: number[]
  ) => number[];
  handleDiceThrow: () => void;
}

export const GameContext = createContext<GameContextProps>({
  randomNum: null,
  players: [],
  currentPlayerTurn: "",
  highlightedPawns: [],
  initGame: () => {},
  higlightStartingPawns: () => [],
  handleDiceThrow: () => {},
});

export const GameContextProvider = ({ children }: any) => {
  const [randomNum, setRandomNum] = useState<null | number>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState("");
  const [highlightedPawns, setHighlightedPawns] = useState<number[]>([]);

  const initGame = useCallback(() => {
    const player = new Player({ color: "red" });
    const computer = new Player({ color: "blue" });

    setCurrentPlayerTurn("red");
    setPlayers([player, computer]);
  }, []);

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

  const contextValue: GameContextProps = {
    randomNum,
    players,
    currentPlayerTurn,
    highlightedPawns,
    initGame,
    higlightStartingPawns,
    handleDiceThrow,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
