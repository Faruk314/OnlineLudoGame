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
  const [chosenColors, setChosenColors] = useState(["red", "blue"]);
  const [playerTurns, setPlayerTurns] = useState<number[]>([]);
  const [chosenPlayers, setChosenPlayers] = useState(2);
  const [randomNum, setRandomNum] = useState<null | number>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [highlightedPawns, setHighlightedPawns] = useState<number[]>([]);
  const [currentPlayerTurnIndex, setCurrentPlayerTurnIndex] = useState<
    number | null
  >(null);

  console.log(playerTurns, "playerTurns");
  console.log(currentPlayerTurnIndex, "playerTurn");

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

  const switchTurns = () => {
    let nextPlayerTurn = currentPlayerTurnIndex! + 1;

    if (nextPlayerTurn > playerTurns.length - 1) {
      nextPlayerTurn = 0;
    }

    setCurrentPlayerTurnIndex(nextPlayerTurn);
  };

  const handleDiceThrow = () => {
    const randomNum = Math.floor(Math.random() * 6 + 1);
    const highlighted = higlightPawns(randomNum);

    if (highlighted.length > 0) {
      setHighlightedPawns(highlighted);
    } else {
      switchTurns();
    }

    setRandomNum(randomNum);
  };

  const findStartingPoint = (player: Player) => {
    //this will find first available starting position
    let firstAvailablePosition = player.startingPositions.find(
      (position) => !player.pawnPositions.includes(position)
    );

    //return first free position
    return firstAvailablePosition!;
  };

  const checkOpponentsPositions = (position: number) => {
    let updatedPlayers = [...players];
    let pawnEaten = false;

    updatedPlayers.forEach((player, index) => {
      //this filters current player and just leaves opponents
      if (index !== currentPlayerTurnIndex) {
        //this finds opponent pawn at position currentPlayer just stepped
        const opponentPawnIndex = player.pawnPositions.indexOf(position);

        //if the position is found then the pawn is eaten and this find the free space at starting point
        if (opponentPawnIndex > -1) {
          player.pawnPositions[opponentPawnIndex] = findStartingPoint(player);
          pawnEaten = true;
        }
      }
    });

    return pawnEaten;
  };

  const handlePlayerMove = (pawnIndex: number) => {
    const updatedPlayers = [...players];
    const playerOnMove = players[currentPlayerTurnIndex!];

    //find that position in positions array and change it
    const positionIndex = playerOnMove.pawnPositions.findIndex(
      (position) => position === pawnIndex
    );

    //check if the move is made from startingPoints and add pawn to starting position
    if (playerOnMove?.startingPositions.includes(pawnIndex)) {
      updatedPlayers[currentPlayerTurnIndex!].pawnPositions[positionIndex] =
        playerOnMove.startingPoint!;

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

      //check if the pawn is at last position
      let isOnLastPosition = nextPosiblePosition === playerOnMove.endpoint;

      console.log(isOnLastPosition, "isOnLastPosition");

      //this function checks if the game is over
      if (isOnLastPosition) {
        updatedPlayers[currentPlayerTurnIndex!].pawnsInFinalZone += 1;

        if (updatedPlayers[currentPlayerTurnIndex!].pawnsInFinalZone === 4) {
          setPlayers(updatedPlayers);

          return console.log("gameOver");
        }
      }

      //check if there is an opponent pawn on that position
      let pawnEaten = checkOpponentsPositions(nextPosiblePosition);

      if (
        pawnEaten === false &&
        randomNum !== 6 &&
        isOnLastPosition === false
      ) {
        switchTurns();
      }

      setHighlightedPawns([]);
      setPlayers(updatedPlayers);
    }
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
