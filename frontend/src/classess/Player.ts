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
  pawnsInFinalZone: number = 3;
  endpoint: number | null = null;

  constructor({ color }: IPlayer) {
    if (!this.color) {
      this.color = color;

      switch (color) {
        case "red":
          this.pawnPositions = [...redZone.playerZones];
          this.path = [...redZone.path];
          this.startingPositions = [...redZone.playerZones];
          this.startingPoint = redZone.startingPoint;
          this.endpoint = redZone.endpoint;
          break;
        case "green":
          this.pawnPositions = [...greenZone.playerZones];
          this.path = [...greenZone.path];
          this.startingPositions = [...greenZone.playerZones];
          this.startingPoint = greenZone.startingPoint;
          this.endpoint = greenZone.endpoint;
          break;
        case "blue":
          this.pawnPositions = [...blueZone.playerZones];
          this.path = [...blueZone.path];
          this.startingPositions = [...blueZone.playerZones];
          this.startingPoint = blueZone.startingPoint;
          this.endpoint = blueZone.endpoint;
          break;
        default:
          this.pawnPositions = [...yellowZone.playerZones];
          this.path = [...yellowZone.path];
          this.startingPositions = [...yellowZone.playerZones];
          this.startingPoint = yellowZone.startingPoint;
          this.endpoint = yellowZone.endpoint;
          break;
      }
    }
  }
}
