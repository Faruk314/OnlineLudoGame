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
  // pawnOnePosition: number | null = null;
  // pawnTwoPosition: number | null = null;
  // pawnThreePosition: number | null = null;
  // pawnFourPosition: number | null = null;

  constructor({ color }: IPlayer) {
    if (!this.color) {
      this.color = color;

      switch (color) {
        case "red":
          this.pawnPositions = [...redZone.playerZones];
          // this.pawnOnePosition = redZone.playerZones[0];
          // this.pawnTwoPosition = redZone.playerZones[1];
          // this.pawnThreePosition = redZone.playerZones[2];
          // this.pawnFourPosition = redZone.playerZones[3];
          break;
        case "green":
          this.pawnPositions = [...greenZone.playerZones];
          // this.pawnOnePosition = greenZone.playerZones[0];
          // this.pawnTwoPosition = greenZone.playerZones[1];
          // this.pawnThreePosition = greenZone.playerZones[2];
          // this.pawnFourPosition = greenZone.playerZones[3];
          break;
        case "blue":
          this.pawnPositions = [...blueZone.playerZones];
          // this.pawnOnePosition = blueZone.playerZones[0];
          // this.pawnTwoPosition = blueZone.playerZones[1];
          // this.pawnThreePosition = blueZone.playerZones[2];
          // this.pawnFourPosition = blueZone.playerZones[3];
          break;
        default:
          this.pawnPositions = [...yellowZone.playerZones];
          // this.pawnOnePosition = yellowZone.playerZones[0];
          // this.pawnTwoPosition = yellowZone.playerZones[1];
          // this.pawnThreePosition = yellowZone.playerZones[2];
          // this.pawnFourPosition = yellowZone.playerZones[3];
          break;
      }
    }
  }
}
