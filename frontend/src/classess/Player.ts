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

  constructor({ color }: IPlayer) {
    if (!this.color) {
      this.color = color;

      switch (color) {
        case "red":
          this.pawnPositions = [...redZone.playerZones];

          break;
        case "green":
          this.pawnPositions = [...greenZone.playerZones];

          break;
        case "blue":
          this.pawnPositions = [...blueZone.playerZones];

          break;
        default:
          this.pawnPositions = [...yellowZone.playerZones];

          break;
      }
    }
  }
}
