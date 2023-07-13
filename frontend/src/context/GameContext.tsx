import React, { createContext, useState, useCallback } from "react";
import { Player } from "../classess/Player";
import {
  redZone,
  blueZone,
  yellowZone,
  greenZone,
  path,
} from "../constants/constants";
import { Zone } from "../types/types";

interface GameContextProps {
  randomNum: null | number;
  players: Player[];
  currentPlayerTurn: string;
  highlightedPawns: number[];
  initGame: () => void;
  higlightStartingPawns: (
    currentPlayerIndex: number,
    pawnZone: Zone
  ) => number[];
  handleDiceThrow: () => void;
  handlePlayerMove: (pawnIndex: number) => void;
}

export const GameContext = createContext<GameContextProps>({
  randomNum: null,
  players: [],
  currentPlayerTurn: "",
  highlightedPawns: [],
  initGame: () => {},
  higlightStartingPawns: (currentPlayerIndex, pawnZone) => [],
  handleDiceThrow: () => {},
  handlePlayerMove: (pawnIndex) => {},
});

export const GameContextProvider = ({ children }: any) => {
  const [randomNum, setRandomNum] = useState<null | number>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState("");
  const [highlightedPawns, setHighlightedPawns] = useState<number[]>([]);
  const [currentPlayerZone, setCurrentPlayerZone] = useState<Zone | null>(null);

  const initGame = useCallback(() => {
    const player = new Player({ color: "red" });
    const computer = new Player({ color: "blue" });

    setCurrentPlayerTurn("red");
    setPlayers([player, computer]);
  }, []);

  const higlightStartingPawns = (
    currentPlayerIndex: number,
    pawnZone: Zone
  ) => {
    const pawnOnePosition = players[currentPlayerIndex].pawnOnePosition;
    const pawnTwoPosition = players[currentPlayerIndex].pawnTwoPosition;
    const pawnThreePosition = players[currentPlayerIndex].pawnThreePosition;
    const pawnFourPosition = players[currentPlayerIndex].pawnFourPosition;

    const pawnOneStartingPosition = pawnZone.playerZones[0];
    const pawnTwoStartingPosition = pawnZone.playerZones[1];
    const pawnThreeStartingPosition = pawnZone.playerZones[2];
    const pawnFourStartingPosition = pawnZone.playerZones[3];

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
    let currentPlayerZone: Zone | null = null;
    let currentPlayerIndex = players.findIndex(
      (player) => player.color === currentPlayerTurn
    );

    if (currentPlayerTurn === "red") {
      currentPlayerZone = redZone;
    }
    if (currentPlayerTurn === "blue") {
      currentPlayerZone = blueZone;
    }

    if (currentPlayerTurn === "green") {
      currentPlayerZone = greenZone;
    }

    if (currentPlayerTurn === "yellow") {
      currentPlayerZone = yellowZone;
    }

    if (randomNum === 6) {
      const highlighted = higlightStartingPawns(
        currentPlayerIndex,
        currentPlayerZone!
      );

      setHighlightedPawns((prev) => [...prev, ...highlighted]);
      console.log(highlighted);
    }

    // const currentPlayerIndex = players.findIndex(
    //   (player) => player.color === currentPlayerTurn
    // );

    // players[currentPlayerIndex] =

    setCurrentPlayerZone(currentPlayerZone);
    setRandomNum(randomNum);
  };

  const handlePlayerMove = (pawnIndex: number) => {
    const updatedPlayers = [...players];
    const playerOnMoveIndex = updatedPlayers.findIndex(
      (player) => player.color === currentPlayerTurn
    );
    const playerOnMove = players[playerOnMoveIndex];
    const currentPawnPosition = Object.keys(playerOnMove).find(
      (key) => playerOnMove[key as keyof Player] === pawnIndex
    );

    if (currentPlayerZone?.playerZones.includes(pawnIndex)) {
      updatedPlayers[playerOnMoveIndex][currentPawnPosition] =
        currentPlayerZone.startingPoint;
    }

    setHighlightedPawns([]);
    setPlayers(updatedPlayers);
  };

  const contextValue: GameContextProps = {
    randomNum,
    players,
    currentPlayerTurn,
    highlightedPawns,
    initGame,
    higlightStartingPawns,
    handleDiceThrow,
    handlePlayerMove,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
