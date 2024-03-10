import { Room } from "../interfaces/Room.js";
import { RoomModel } from "../models/RoomModel.js";

async function updateMoveToDB(roomName: string, madeMove: any): Promise<void> {
  try {
    const updatedRoom = await RoomModel.findOneAndUpdate({ roomName },
      {
        $push: { moves: madeMove },
      },
      { new: true },
    );

    if (!updatedRoom) {
      console.error("Room not found for update:", roomName);
      return;
    }
  } catch (error) {
    console.error("Error fetching room from the database:", error);
  }
}

async function updateTimeToDB(roomName: string, playerID: string, color: string, time: number): Promise<void> {
  try {
    const dbRoom: Room = await RoomModel.findOne({ roomName });
    const playerColor: string = dbRoom.players[playerID].color;

    let updatedID: string;

    if (playerColor !== color) {
      const opponentID: string = Object.keys(dbRoom.players).find(id => id !== playerID);
      updatedID = opponentID;
    } else {
      updatedID = playerID;
    }

    const updatedRoom = await RoomModel.findOneAndUpdate({ roomName },
      {
        $set: {
          [`players.${updatedID}.timeLeft`]: time
        }
      },
      { new: true },
    );

    if (!updatedRoom) {
      console.error("Room not found for update:", roomName);
      return;
    }
  } catch (error) {
    console.error("Error fetching room from the database:", error);
  }
}

export { updateMoveToDB, updateTimeToDB };