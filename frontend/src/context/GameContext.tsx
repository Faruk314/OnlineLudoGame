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
  currentPlayerTurnIndex: null | number;
  highlightedPawns: number[];
  initGame: () => void;
  higlightPawns: (randomNum: number, pawnZone: Zone) => number[];
  handleDiceThrow: () => void;
  handlePlayerMove: (pawnIndex: number) => void;
}

export const GameContext = createContext<GameContextProps>({
  randomNum: null,
  players: [],
  currentPlayerTurnIndex: null,
  highlightedPawns: [],
  initGame: () => {},
  higlightPawns: (randomNum, pawnZone) => [],
  handleDiceThrow: () => {},
  handlePlayerMove: (pawnIndex) => {},
});

export const GameContextProvider = ({ children }: any) => {
  const [randomNum, setRandomNum] = useState<null | number>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [highlightedPawns, setHighlightedPawns] = useState<number[]>([]);
  const [currentPlayerZone, setCurrentPlayerZone] = useState<Zone | null>(null);
  const [currentPlayerTurnIndex, setCurrentPlayerTurnIndex] = useState<
    number | null
  >(null);

  const initGame = useCallback(() => {
    const player = new Player({ color: "red" });
    const computer = new Player({ color: "blue" });

    setCurrentPlayerTurnIndex(0);
    setPlayers([player, computer]);
  }, []);

  const higlightPawns = (randomNum: number, pawnZone: Zone) => {
    const playerOnMove = players[currentPlayerTurnIndex!];
    const highlighted: number[] = [];

    playerOnMove.pawnPositions.forEach((position) => {
      if (currentPlayerZone?.playerZones.includes(position)) {
        highlighted.push(position);
      }
    });

    return highlighted;
  };

  const handleDiceThrow = () => {
    const randomNum = Math.floor(Math.random() * 6 + 1);
    let currentPlayerZone: Zone | null = null;
    let currentPlayer = players[currentPlayerTurnIndex!];

    if (currentPlayer.color === "red") {
      currentPlayerZone = redZone;
    }
    if (currentPlayer.color === "blue") {
      currentPlayerZone = blueZone;
    }

    if (currentPlayer.color === "green") {
      currentPlayerZone = greenZone;
    }

    if (currentPlayer.color === "yellow") {
      currentPlayerZone = yellowZone;
    }

    const highlighted = higlightPawns(randomNum, currentPlayerZone!);

    setHighlightedPawns((prev) => [...prev, ...highlighted]);
    console.log(highlighted);

    setCurrentPlayerZone(currentPlayerZone);
    setRandomNum(randomNum);
  };

  const handlePlayerMove = (pawnIndex: number) => {
    const updatedPlayers = [...players];

    const playerOnMove = players[currentPlayerTurnIndex!];

    //find that position in positions array and change it
    const positionIndex = playerOnMove.pawnPositions.findIndex(
      (position) => position === pawnIndex
    );

    if (currentPlayerZone?.playerZones.includes(pawnIndex)) {
      updatedPlayers[currentPlayerTurnIndex!].pawnPositions[positionIndex] =
        currentPlayerZone.startingPoint;
    }

    //change turns
    const opponentIndex = players.findIndex(
      (player) => player.color !== playerOnMove.color
    );

    setCurrentPlayerTurnIndex(opponentIndex);
    setHighlightedPawns([]);
    setPlayers(updatedPlayers);
  };

  const contextValue: GameContextProps = {
    randomNum,
    players,
    currentPlayerTurnIndex,
    highlightedPawns,
    initGame,
    higlightPawns,
    handleDiceThrow,
    handlePlayerMove,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
