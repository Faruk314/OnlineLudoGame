import { IPlayer } from "../types/types";
import {
  redZone,
  greenZone,
  yellowZone,
  blueZone,
} from "../constants/constants";

export class Player {
  color: null | string = null;
  pawnPositions: number[] = [];
  path: number[] = [];
  startingPositions: number[] = [];
  startingPoint: number | null = null;

  constructor({ color }: IPlayer) {
    if (!this.color) {
      this.color = color;

      switch (color) {
        case "red":
          this.pawnPositions = [92, ...redZone.playerZones];
          this.path = [...redZone.path];
          this.startingPositions = [...redZone.playerZones];
          this.startingPoint = redZone.startingPoint;
          break;
        case "green":
          this.pawnPositions = [...greenZone.playerZones];
          this.path = [...greenZone.path];
          this.startingPositions = [...greenZone.playerZones];
          this.startingPoint = greenZone.startingPoint;
          break;
        case "blue":
          this.pawnPositions = [93, 94, 95, 96];
          this.path = [...blueZone.path];
          this.startingPositions = [...blueZone.playerZones];
          this.startingPoint = blueZone.startingPoint;
          break;
        default:
          this.pawnPositions = [...yellowZone.playerZones];
          this.path = [...yellowZone.path];
          this.startingPositions = [...yellowZone.playerZones];
          this.startingPoint = yellowZone.startingPoint;
          break;
      }
    }
  }
}
