import React, { createContext, useState, useCallback } from "react";
import { Player } from "../classess/Player";
import { Zone } from "../types/types";

interface GameContextProps {
  randomNum: null | number;
  players: Player[];
  currentPlayerTurnIndex: null | number;
  highlightedPawns: number[];
  initGame: () => void;
  higlightPawns: (randomNum: number) => number[];
  handleDiceThrow: () => void;
  handlePlayerMove: (pawnIndex: number) => void;
}

export const GameContext = createContext<GameContextProps>({
  randomNum: null,
  players: [],
  currentPlayerTurnIndex: null,
  highlightedPawns: [],
  initGame: () => {},
  higlightPawns: (randomNum) => [],
  handleDiceThrow: () => {},
  handlePlayerMove: (pawnIndex) => {},
});

export const GameContextProvider = ({ children }: any) => {
  const [randomNum, setRandomNum] = useState<null | number>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [highlightedPawns, setHighlightedPawns] = useState<number[]>([]);
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

  const higlightPawns = (randomNum: number) => {
    const playerOnMove = players[currentPlayerTurnIndex!];
    const highlighted: number[] = [];

    playerOnMove.pawnPositions.forEach((position) => {
      //find pawns that are in a starting positions(playerZones)
      if (
        playerOnMove?.startingPositions.includes(position) &&
        randomNum === 6
      ) {
        highlighted.push(position);
      }

      //find pawns that are in path
      let positionIndex = playerOnMove.path.findIndex(
        (pathPosition) => pathPosition === position
      );

      //check if the move is posible
      if (positionIndex !== -1) {
        let nextPossiblePositionIndex = positionIndex + randomNum;

        let nextPossiblePosition = playerOnMove.path.find(
          (position, index) => index === nextPossiblePositionIndex
        );

        if (nextPossiblePosition === undefined) return;

        highlighted.push(position);
      }
    });

    return highlighted;
  };

  const handleDiceThrow = () => {
    const randomNum = Math.floor(Math.random() * 6 + 1);

    const highlighted = higlightPawns(randomNum);

    setHighlightedPawns(highlighted);

    setRandomNum(randomNum);
  };

  const eatPawn = (position: number) => {};

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
    if (playerOnMove?.startingPositions.includes(pawnIndex)) {
      updatedPlayers[currentPlayerTurnIndex!].pawnPositions[positionIndex] =
        playerOnMove.startingPoint!;

      // return changeTurns(opponentIndex, updatedPlayers);
      setHighlightedPawns([]);
      setPlayers(updatedPlayers);
      return;
    }

    //if the move is made from path move player to next posibble position
    let pathPositionIndex = playerOnMove?.path.findIndex(
      (pathPosition) => pathPosition === pawnIndex
    );

    if (pathPositionIndex === undefined) return;

    let nextPossiblePositionIndex = randomNum! + pathPositionIndex;

    let nextPosiblePosition = playerOnMove?.path.find(
      (position, index) => index === nextPossiblePositionIndex
    );

    if (nextPosiblePosition) {
      updatedPlayers[currentPlayerTurnIndex!].pawnPositions[positionIndex] =
        nextPosiblePosition;

      //check if there is an opponent pawn on that position
      if (
        players[opponentIndex].pawnPositions.indexOf(nextPosiblePosition) !== -1
      ) {
        eatPawn(nextPosiblePosition);
      }
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
