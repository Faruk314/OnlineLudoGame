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

  // const path = [
  //   202, 187, 172, 157, 142, 126, 125, 124, 123, 122, 121, 106, 91, 92, 93, 94,
  //   95, 96, 82, 67, 52, 37, 22, 7, 8, 9, 24, 39, 54, 69, 84, 100, 101, 102, 103,
  //   104, 105, 120, 135, 134, 133, 132, 131, 130, 144, 159, 174, 189, 204, 219,
  //   218, 217,
  // ];

  const higlightPawns = (randomNum: number, pawnZone: Zone) => {
    const playerOnMove = players[currentPlayerTurnIndex!];
    const highlighted: number[] = [];

    playerOnMove.pawnPositions.forEach((position) => {
      //find pawns that are in a starting positions(playerZones)
      if (
        currentPlayerZone?.playerZones.includes(position) &&
        randomNum === 6
      ) {
        highlighted.push(position);
      }

      //find pawns that are in path
      let positionIndex = pawnZone.path.findIndex(
        (pathPosition) => pathPosition === position
      );

      //check if the move is posible
      if (positionIndex !== -1) {
        let nextPossiblePositionIndex = positionIndex + randomNum;

        let nextPossiblePosition = pawnZone.path.find(
          (position, index) => index === nextPossiblePositionIndex
        );

        console.log(nextPossiblePositionIndex, "higlight");
        console.log(nextPossiblePosition, "higlight");

        if (nextPossiblePosition === undefined) return;

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

    setHighlightedPawns(highlighted);
    console.log(highlighted);

    setCurrentPlayerZone(currentPlayerZone);
    setRandomNum(randomNum);
  };

  const handlePlayerMove = (pawnIndex: number) => {
    const updatedPlayers = [...players];
    const playerOnMove = players[currentPlayerTurnIndex!];
    const opponentIndex = players.findIndex(
      (player) => player.color !== playerOnMove.color
    );

    //find that position in positions array and change it
    const positionIndex = playerOnMove.pawnPositions.findIndex(
      (position) => position === pawnIndex
    );

    //check if the move is made from startingPoints and add pawn to starting position
    if (currentPlayerZone?.playerZones.includes(pawnIndex)) {
      updatedPlayers[currentPlayerTurnIndex!].pawnPositions[positionIndex] =
        currentPlayerZone.startingPoint;

      // return changeTurns(opponentIndex, updatedPlayers);
      setHighlightedPawns([]);
      setPlayers(updatedPlayers);
      return;
    }

    console.log("randomnum and position index", randomNum, positionIndex);

    //if the move is made from path move player to next posibble position
    let pathPositionIndex = currentPlayerZone?.path.findIndex(
      (pathPosition) => pathPosition === pawnIndex
    );

    console.log(pathPositionIndex, "pathpositionIndex");

    if (pathPositionIndex === undefined) return;

    let nextPossiblePositionIndex = randomNum! + pathPositionIndex;

    console.log("nextPossiblePositionIndex - move", nextPossiblePositionIndex);

    let nextPosiblePosition = currentPlayerZone?.path.find(
      (position, index) => index === nextPossiblePositionIndex
    );

    console.log(nextPosiblePosition, "move");

    if (nextPosiblePosition) {
      updatedPlayers[currentPlayerTurnIndex!].pawnPositions[positionIndex] =
        nextPosiblePosition;

      // return changeTurns(opponentIndex, updatedPlayers);
      setHighlightedPawns([]);
      setPlayers(updatedPlayers);
      return;
    }

    //change turns
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
