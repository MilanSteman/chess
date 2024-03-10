import { RoomData, RoomStatus } from "../enums/RoomData";
import { Room } from "../interfaces/Room.js";
import { RoomModel } from "../models/RoomModel";
import { DEFAULT_TIME } from "./generateRoom";
import { getPlayerAmount } from "./getPlayerAmount.js";
import { setOppositeColor } from "./setColor.js";

/**
 * Finds the first available room out of all rooms
 * @returns A room if one can be joined, otherwise null
 */
async function findAvailableRoom(
  rooms: Map<string, Room>,
  playerID: string,
): Promise<Room> | null {
  for (const room of rooms.values()) {
    const playersInRoom: number = getPlayerAmount(room);

    if (
      room.roomStatus !== RoomStatus.WAITING ||
      playersInRoom >= RoomData.MAX_PLAYERS
    ) {
      return null;
    }

    // If there is a room available, add the queuing player to it
    room.players[playerID] = {
      color: setOppositeColor(room),
      timeLeft: DEFAULT_TIME,
    };

    const { roomName } = room;

    try {
      await RoomModel.findOneAndUpdate({ roomName }, room);
      const updatedRoom = await RoomModel.findOne({ roomName });
      return updatedRoom.toObject();
    } catch (error) {
      console.error("Error updating room:", error);
    }

    return room;
  }

  return null;
}

export { findAvailableRoom };
