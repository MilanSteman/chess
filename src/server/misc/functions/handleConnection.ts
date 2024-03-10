import { Socket } from "socket.io";
import { generateRandomName } from "./generateRandomName";
import { Room } from "../interfaces/Room";
import { RoomModel } from "../models/RoomModel";
import { Colors } from "../enums/Colors";

function handleConnection(socket: Socket): string {
  const playerID: string | undefined = socket.handshake.headers.cookie?.split('=')[1];

  if (playerID) {
    return playerID;
  }

  const generatedPlayerID: string = generateRandomName();

  socket.emit('setCookie', { name: 'playerID', value: generatedPlayerID });

  socket.handshake.headers.cookie = `playerId=${generatedPlayerID}`;
  socket.handshake.headers['Access-Control-Allow-Headers'] = 'playerID';

  return generatedPlayerID;
}

async function handleReconnection(socket: Socket, room: Room, playerID: string): Promise<void> {
  if (!room) {
    return;
  }

  try {
    const { roomName } = room;
    const dbRoom: Room = await RoomModel.findOne({ roomName });
    socket.join(roomName);

    const color: string = dbRoom.players[playerID].color;
    const moves: [] = dbRoom.moves;

    const opponentID: string = Object.keys(room.players).find(id => id !== playerID);
    const whiteTime: number = color === Colors.WHITE ? dbRoom.players[playerID].timeLeft : dbRoom.players[opponentID].timeLeft;
    const blackTime: number = color === Colors.BLACK ? dbRoom.players[playerID].timeLeft : dbRoom.players[opponentID].timeLeft;

    socket.emit("startMatch", { color, moves, whiteTime, blackTime });
  } catch (error) {
    console.error("Error fetching room from the database:", error);
  }
}

export { handleConnection, handleReconnection };