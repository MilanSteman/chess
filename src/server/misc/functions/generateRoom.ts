import { Model } from "mongoose";
import { RoomStatus } from "../enums/RoomData.js";
import { Room } from "../interfaces/Room.js";
import { RoomModel } from "../models/RoomModel.js";
import { generateRandomName } from "./generateRandomName.js";
import { setRandomColor } from "./setColor.js";

const DEFAULT_TIME: number = 1200;

/**
 * Generates a room
 * @returns A room following the room interface
 */
async function generateRoom(playerID: string): Promise<Room> {
  const roomName: string = generateRandomName();
  const roomStatus: string = RoomStatus.WAITING;

  const generatedRoom = new RoomModel({
    roomName,
    roomStatus,
    players: {
      [playerID]: {
        color: setRandomColor(),
        timeLeft: DEFAULT_TIME,
      },
    },
    moves: [],
  });

  try {
    await generatedRoom.save();
    return generatedRoom.toObject();
  } catch (error) {
    console.error("Error creating room:", error);
    return null;
  }
}

export { generateRoom, DEFAULT_TIME };
