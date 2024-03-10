import { Room } from "../interfaces/Room.js";

/**
 * Gets the player amount in a room
 * @returns A number that is less or equal than the max player amount
 */
function getPlayerAmount(room: Room): number {
  return Object.keys(room.players).length;
}

export { getPlayerAmount };
