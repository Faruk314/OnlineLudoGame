import { Player } from "../classess/Player";

export interface IPlayer {
  color: string;
}

export interface Zone {
  startingPoint: number;
  border: number[];
  playerZones: number[];
  finalZones: number[];
  endpoint: number;
  path: number[];
}

export interface GameState {
  gameId: string;
  playerTurns: number[];
  highlightedPawns: number[];
  isGameOver: boolean;
  players: Player[];
  currentPlayerTurnIndex: number;
}
