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
  const [chosenColors, setChosenColors] = useState(["red", "blue", "green"]);
  const [playerTurns, setPlayerTurns] = useState<number[]>([]);
  const [chosenPlayers, setChosenPlayers] = useState(3);
  const [randomNum, setRandomNum] = useState<null | number>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [highlightedPawns, setHighlightedPawns] = useState<number[]>([]);
  const [currentPlayerTurnIndex, setCurrentPlayerTurnIndex] = useState<
    number | null
  >(null);

  console.log(players);

  const initGame = useCallback(() => {
    let turns: number[] = [];
    let currentPlayerIndex: number | null = null;
    let colors = ["red", "blue", "yellow", "green"];
    let playerOne: Player | null = null;
    let playerTwo: Player | null = null;
    let playerThree: Player | null = null;
    let playerFour: Player | null = null;

    //this is determining the turns and colors
    if (chosenPlayers === 4) {
      turns = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
      colors = colors.sort(() => Math.random() - 0.5);
      currentPlayerIndex = turns[0];

      playerOne = new Player({ color: colors[0] });
      playerTwo = new Player({ color: colors[1] });
      playerThree = new Player({ color: colors[2] });
      playerFour = new Player({ color: colors[3] });

      setPlayers([playerOne, playerTwo, playerThree, playerFour]);
    } else if (chosenPlayers === 3) {
      turns = [0, 1, 2].sort(() => Math.random() - 0.5);
      currentPlayerIndex = turns[0];

      playerOne = new Player({ color: chosenColors[0] });
      playerTwo = new Player({ color: chosenColors[1] });
      playerThree = new Player({ color: chosenColors[2] });

      setPlayers([playerOne, playerTwo, playerThree]);
    } else if (chosenPlayers === 2) {
      turns = [0, 1].sort(() => Math.random() - 0.5);
      currentPlayerIndex = turns[0];

      playerOne = new Player({ color: chosenColors[0] });
      playerTwo = new Player({ color: chosenColors[1] });

      setPlayers([playerOne, playerTwo]);
    }

    console.log(turns);

    setPlayerTurns(turns);
    setCurrentPlayerTurnIndex(currentPlayerIndex);
  }, [chosenPlayers]);

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
