import { Room } from "../interfaces/Room.js";
import { RoomModel } from "../models/RoomModel.js";

function findRoomFromPlayer(rooms: Map<string, Room>, playerID: string): Room | null {
  return Array.from(rooms.values()).find(room => room.players[playerID]) || null;
}

async function findAndDeletePlayerInRoom(rooms: Map<string, Room>, playerID: string): Promise<void> {
  const room: Room = findRoomFromPlayer(rooms, playerID);

  if (room) {
    delete room.players[playerID];

    if (Object.keys(room.players).length === 0) {
      rooms.delete(room.roomName);
      console.log(`Room deleted: ${room.roomName}`)

      const { roomName } = room;

      try {
        await RoomModel.deleteOne({ roomName }, room);
        console.log(`Deleted room ${roomName} from the database.`);
      } catch (error) {
        console.error("Error updating room:", error);
      }
    }
  }
}

export { findRoomFromPlayer, findAndDeletePlayerInRoom };