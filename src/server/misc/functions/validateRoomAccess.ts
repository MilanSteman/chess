import { Response, NextFunction } from "express";
import { app } from "../../server.js";
import { Room } from "../interfaces/Room.js";
import { findRoomFromPlayer } from "./findAndDeletePlayerInRoom";
import { CustomRequest } from "../interfaces/CustomRequest.js";

function validateRoomAccess(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): void {
  const foundRoom: Room | null = findRoomFromPlayer(app.rooms, req.playerID);

  if (!foundRoom || foundRoom.roomName !== req.params.roomName) {
    return res.redirect("/");
  }

  next();
}

function redirectIfInRoom(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): void {
  const foundRoom: Room | null = findRoomFromPlayer(app.rooms, req.playerID);

  if (foundRoom) {
    return res.redirect(`/room/${foundRoom.roomName}`);
  }

  next();
}

export { validateRoomAccess, redirectIfInRoom };
