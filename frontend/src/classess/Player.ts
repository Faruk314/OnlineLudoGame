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
          this.pawnPositions = [92, ...redZone.playerZones];

          break;
        case "green":
          this.pawnPositions = [...greenZone.playerZones];

          break;
        case "blue":
          this.pawnPositions = [93, 94, 95, 96];

          break;
        default:
          this.pawnPositions = [...yellowZone.playerZones];

          break;
      }
    }
  }
}
