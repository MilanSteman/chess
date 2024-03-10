import express, { Response, NextFunction, Request } from 'express';
import http from "http";
import dotenv from "dotenv";
import nunjucks from "nunjucks";
import { Server, Socket } from 'socket.io';
import cookieParser from 'cookie-parser';

import router from "./router/router.js";
import { Room } from "./misc/interfaces/Room.js";
import { findAvailableRoom } from "./misc/functions/findAvailableRoom.js";
import { generateRoom } from "./misc/functions/generateRoom.js";
import { findAndDeletePlayerInRoom, findRoomFromPlayer } from "./misc/functions/findAndDeletePlayerInRoom.js";
import { getPlayerAmount } from "./misc/functions/getPlayerAmount.js";
import { RoomData, RoomStatus } from "./misc/enums/RoomData.js";
import { handleConnection, handleReconnection } from "./misc/functions/handleConnection.js";
import { CustomRequest } from './misc/interfaces/CustomRequest.js';
import { connectToDB } from './misc/config/connectToDB.js';
import { updateMoveToDB, updateTimeToDB } from './misc/functions/updateToDB.js';

dotenv.config();

const PORT: number = Number(process.env.PORT) || 3000;
const SIXTY_SECONDS: number = 60 * 1000;

class App {
  private server: http.Server;
  private port: number;
  private io: Server;
  public rooms: Map<string, Room>;
  private disconnectTimeouts: Map<string, NodeJS.Timeout>;

  constructor(port: number) {
    this.port = port
    this.disconnectTimeouts = new Map();

    const app = express();

    this.server = new http.Server(app);
    this.io = new Server(this.server);
    this.rooms = new Map();

    app
      .set("view engine", "njk")
      .set("views", "src/views/")
      .set("socketio", this.io);

    app
      .use(express.static("dist/client"))
      .use(express.urlencoded({ extended: true }))
      .use(express.json())
      .use(cookieParser())
      .use(this.attachPlayerIDToRequest)
      .use("/", router);

    nunjucks.configure("src/views/", {
      autoescape: true,
      express: app,
    });

    this.io.on("connection", (socket) => {
      console.log(`An user connected: ${socket.id}`);
      this.handleUserConnection(socket);
    });
  }

  private attachPlayerIDToRequest(req: CustomRequest, res: Response, next: NextFunction): void {
    // Middleware to attach playerID to the request object
    const playerID: string = req.cookies.playerID;
    req.playerID = playerID;
    next();
  }

  private handleUserConnection(socket: Socket): void {
    console.log(`An user connected: ${socket.id}`);
    const playerID: string = handleConnection(socket);
    const inRoom: Room = findRoomFromPlayer(this.rooms, playerID);

    // Clear the timeout if the player reconnects
    const disconnectTimeout = this.disconnectTimeouts.get(playerID);

    if (disconnectTimeout) {
      clearTimeout(disconnectTimeout);
      this.disconnectTimeouts.delete(playerID);
      console.log(`Player reconnected within the timeout: ${socket.id}`);
    }

    if (inRoom) {
      this.handleUserReconnection(socket, inRoom, playerID);
      this.io.to(inRoom.roomName).emit("unfreeze");
      this.io.to(inRoom.roomName).emit("cleanup");
    }

    socket.on("startQueue", async () => {
      this.handleStartQueue(socket, playerID);
    });

    socket.on("move", (madeMove, color) => {
      this.handleMove(socket, playerID, madeMove, color);
    });

    socket.on("updateTime", async (time, color) => {
      this.handleUpdateTime(socket, playerID, time, color);
    });

    socket.on("returnToLobby", async () => {
      this.handleReturnToLobby(socket, playerID);
    });

    socket.on("disconnect", async () => {
      this.handleUserDisconnect(socket, playerID);
    });
  }

  private handleUserReconnection(socket: Socket, inRoom: Room, playerID: string): void {
    handleReconnection(socket, inRoom, playerID);
    this.io.to(inRoom.roomName).emit("unfreeze");
    this.io.to(inRoom.roomName).emit("cleanup");
  }

  private async handleStartQueue(socket: Socket, playerID: string): Promise<void> {
    try {
      let room: Room | null = await findAvailableRoom(this.rooms, playerID);

      if (!room) {
        room = await generateRoom(playerID);
      }

      socket.join(room.roomName);
      this.rooms.set(room.roomName, room);

      if (getPlayerAmount(room) < RoomData.MAX_PLAYERS) {
        socket.emit("isInQueue", room.roomName, room.roomStatus);
      } else {
        this.io.to(room.roomName).emit("joinMatch", room.roomName);
        room.roomStatus = RoomStatus.PLAYING;
      }

      // Log players for each room
      this.rooms.forEach((room, roomKey) => {
        console.log(`Players in room ${roomKey}:`, room.players);
      });
    } catch (error) {
      console.error("Error starting queue:", error);
    }
  }

  private handleMove(socket: Socket, playerID: string, madeMove: any, color: string): void {
    const room: Room = findRoomFromPlayer(this.rooms, playerID);

    // To avoid duplication of made move
    const playerColor: string = room.players[playerID].color;

    if (color !== playerColor) {
      updateMoveToDB(room.roomName, madeMove);
      this.io.to(room.roomName).emit("movePiece", madeMove);
    }
  }

  private handleUpdateTime(socket: Socket, playerID: string, time: number, color: string): void {
    const room: Room = findRoomFromPlayer(this.rooms, playerID);

    if (room) {
      updateTimeToDB(room.roomName, playerID, color, time);
    }
  }

  private handleReturnToLobby(socket: Socket, playerID: string): void {
    findAndDeletePlayerInRoom(this.rooms, playerID);
    socket.emit("sendToHome");
  }

  private handleUserDisconnect(socket: Socket, playerID: string): void {
    const room: Room = findRoomFromPlayer(this.rooms, playerID);

    if (room && room.roomStatus === RoomStatus.WAITING) {
      findAndDeletePlayerInRoom(this.rooms, playerID);
    }

    if (room && room.roomStatus === RoomStatus.PLAYING) {
      this.io.to(room.roomName).emit("freeze");
      const disconnectTime: number = SIXTY_SECONDS;

      this.io.to(room.roomName).emit("disconnectNotification", disconnectTime);

      const disconnectTimeout = setTimeout(async () => {
        this.io.to(room.roomName).emit("disconnectEnd");
        console.log(`Game ended due to player disconnect: ${socket.id}`);
      }, disconnectTime);

      // Store the timeout associated with the player
      this.disconnectTimeouts.set(playerID, disconnectTimeout);
    }

    console.log(`An user disconnected: ${socket.id}`);
  }

  public start(): void {
    this.server.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });

    connectToDB();
  }
}

const app = new App(PORT);
app.start();

export { app };
