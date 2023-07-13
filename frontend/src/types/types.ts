export interface IPlayer {
  color: string;
}

export interface Zone {
  startingPoint: number;
  border: number[];
  playerZones: number[];
  finalZones: number[];
}
