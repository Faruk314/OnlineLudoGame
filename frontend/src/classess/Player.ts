import { IPlayer } from "../types/types";
import {
  redZone,
  greenZone,
  yellowZone,
  blueZone,
  path,
} from "../constants/constants";

export class Player {
  color: null | string = null;
  pawnOnePosition: number | null = null;
  pawnTwoPosition: number | null = null;
  pawnThreePosition: number | null = null;
  pawnFourPosition: number | null = null;

  constructor({ color }: IPlayer) {
    if (!this.color) {
      this.color = color;

      switch (color) {
        case "red":
          this.pawnOnePosition = redZone.playerZones[0];
          this.pawnTwoPosition = redZone.playerZones[1];
          this.pawnThreePosition = redZone.playerZones[2];
          this.pawnFourPosition = redZone.playerZones[3];
          break;
        case "green":
          this.pawnOnePosition = 42;
          this.pawnTwoPosition = 43;
          this.pawnThreePosition = 57;
          this.pawnFourPosition = 58;
          break;
        case "blue":
          this.pawnOnePosition = 168;
          this.pawnTwoPosition = 169;
          this.pawnThreePosition = 183;
          this.pawnFourPosition = 184;
          break;
        default:
          this.pawnOnePosition = 177;
          this.pawnTwoPosition = 178;
          this.pawnThreePosition = 192;
          this.pawnFourPosition = 193;
          break;
      }
    }
  }
}
