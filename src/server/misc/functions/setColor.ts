import { Colors } from "../enums/Colors.js";
import { Room } from "../interfaces/Room.js";

/**
 * Sets a random color between black or white
 * @returns A string with either 'black' or 'white'
 */
function setRandomColor(): string {
  return Math.random() < 0.5 ? Colors.BLACK : Colors.WHITE;
}

/**
 * Sets the opposite color between black or white
 * @returns A string with either 'black' or 'white'
 */
function setOppositeColor(room: Room): string {
  const existingColor = Object.values(room.players)[0]?.color;

  return existingColor === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
}

export { setRandomColor, setOppositeColor };
