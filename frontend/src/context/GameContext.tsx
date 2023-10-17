import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { Player } from "../classess/Player";
import { SoundContext } from "./SoundContext";
import { move, safeZones, win } from "../constants/constants";
import axios from "axios";
import { SocketContext } from "./SocketContext";
import { GameState } from "../types/types";

interface GameContextProps {
  randomNum: null | number;
  players: Player[];
  currentPlayerTurnIndex: null | number;
  highlightedPawns: number[];
  initGame: () => Promise<string | null | undefined>;
  higlightPawns: (randomNum: number) => number[];
  handleDiceThrow: () => void;
  handlePlayerMove: (pawnIndex: number) => void;
  playerTurns: number[];
  isGameOver: boolean;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setChosenColors: React.Dispatch<React.SetStateAction<string[]>>;
  setChosenPlayers: React.Dispatch<React.SetStateAction<number>>;
  setGameId: React.Dispatch<React.SetStateAction<string | null>>;
  chosenColors: string[];
  chosenPlayers: number;
  gameId: string | null;
  retrieveGameState: (gameId: string) => Promise<boolean>;
  updateGameState: (gameState: GameState) => void;
  deleteGameState: (gameId: string) => Promise<void>;
  isMultiplayer: boolean;
  resetGameStates: () => void;
}

export const GameContext = createContext<GameContextProps>({
  randomNum: null,
  players: [],
  currentPlayerTurnIndex: null,
  highlightedPawns: [],
  initGame: async () => null,
  higlightPawns: (randomNum) => [],
  handleDiceThrow: () => {},
  handlePlayerMove: (pawnIndex) => {},
  playerTurns: [],
  isGameOver: false,
  setGameOver: () => {},
  setChosenColors: () => {},
  setChosenPlayers: () => {},
  chosenColors: [],
  chosenPlayers: 0,
  gameId: null,
  setGameId: () => {},
  retrieveGameState: async (gameId) => false,
  deleteGameState: async (gameId) => {},
  updateGameState: (gameState) => {},
  isMultiplayer: false,
  resetGameStates: () => {},
});

export const GameContextProvider = ({ children }: any) => {
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null);
  const [isGameOver, setGameOver] = useState(false);
  const [chosenColors, setChosenColors] = useState<string[]>([]);
  const [playerTurns, setPlayerTurns] = useState<number[]>([]);
  const [chosenPlayers, setChosenPlayers] = useState(0);
  const [randomNum, setRandomNum] = useState<null | number>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const { playSound } = useContext(SoundContext);
  const [highlightedPawns, setHighlightedPawns] = useState<number[]>([]);
  const [currentPlayerTurnIndex, setCurrentPlayerTurnIndex] = useState<
    number | null
  >(null);
  const { socket } = useContext(SocketContext);

  const updateGameState = (gameState: GameState) => {
    setGameId(gameState.gameId);
    setPlayerTurns(gameState.playerTurns);
    setHighlightedPawns(gameState.highlightedPawns);
    setGameOver(gameState.isGameOver);
    setPlayers(gameState.players);
    setCurrentPlayerTurnIndex(gameState.currentPlayerTurnIndex);
    setChosenColors(gameState.chosenColors);
    setChosenPlayers(gameState.chosenPlayers);
    setRandomNum(gameState.randomNum);
    setIsMultiplayer(gameState.isMultiplayer);
  };

  const retrieveGameState = async (gameId: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/game/getGameState",
        { gameId }
      );

      const gameState = response.data;

      console.log(gameState, "gameState");

      updateGameState({
        gameId: gameState.gameId,
        playerTurns: gameState.playerTurns,
        highlightedPawns: gameState.highlightedPawns,
        isGameOver: gameState.isGameOver,
        players: gameState.players,
        currentPlayerTurnIndex: gameState.currentPlayerTurnIndex,
        randomNum: gameState.randomNum,
        chosenPlayers: gameState.chosenPlayers,
        chosenColors: gameState.chosenColors,
        isMultiplayer: gameState.isMultiplayer,
      });

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  };

  const initGame = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/game/initGame",
        {
          chosenplayersNum: chosenPlayers,
          chosenColorsArr: chosenColors,
        }
      );

      if (response.data) {
        setGameId(response.data);

        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const updateGameState = async () => {
      const game = {
        gameId,
        isGameOver,
        chosenPlayers,
        chosenColors,
        currentPlayerTurnIndex,
        highlightedPawns,
        randomNum,
        playerTurns,
        players,
        isMultiplayer,
      };

      try {
        await axios.post("http://localhost:5000/api/game/updateGameState", {
          updatedGameState: game,
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (!isMultiplayer) {
      updateGameState();
    }
  }, [
    currentPlayerTurnIndex,
    isGameOver,
    highlightedPawns,
    players,
    randomNum,
    playerTurns,
    gameId,
  ]);

  const resetGameStates = () => {
    setGameId(null);
    setPlayerTurns([]);
    setHighlightedPawns([]);
    setGameOver(false);
    setPlayers([]);
    setCurrentPlayerTurnIndex(null);
    setChosenColors([]);
    setChosenPlayers(0);
    setRandomNum(null);
    setIsMultiplayer(false);
  };

  const deleteGameState = async (gameId: string) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/game/deleteGameState/${gameId}`
      );

      resetGameStates();
    } catch (error) {
      console.log(error);
    }
  };

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
    if (isMultiplayer) {
      socket?.emit("diceRoll", gameId);
      return;
    }

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
        if (opponentPawnIndex > -1 && !safeZones.includes(position)) {
          player.pawnPositions[opponentPawnIndex] = findStartingPoint(player);
          pawnEaten = true;
        }
      }
    });

    return pawnEaten;
  };

  const handlePlayerMove = (pawnIndex: number) => {
    playSound(move);

    if (isMultiplayer) {
      socket?.emit("playerMove", { gameId, pawnIndex });
      return;
    }

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

      //this function checks if the game is over
      if (isOnLastPosition) {
        updatedPlayers[currentPlayerTurnIndex!].pawnsInFinalZone += 1;

        if (updatedPlayers[currentPlayerTurnIndex!].pawnsInFinalZone === 4) {
          setPlayers(updatedPlayers);
          playSound(win);

          return setGameOver(true);
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
    gameId,
    deleteGameState,
    retrieveGameState,
    updateGameState,
    setGameId,
    setChosenPlayers,
    setChosenColors,
    chosenPlayers,
    chosenColors,
    setGameOver,
    isGameOver,
    randomNum,
    playerTurns,
    players,
    currentPlayerTurnIndex,
    highlightedPawns,
    initGame,
    higlightPawns,
    handleDiceThrow,
    handlePlayerMove,
    isMultiplayer,
    resetGameStates,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
