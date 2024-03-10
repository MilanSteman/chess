import { Router } from "express";
import { redirectIfInRoom, validateRoomAccess } from "../misc/functions/validateRoomAccess";

const router: Router = Router();

router.get("/", redirectIfInRoom, (req, res) => {
  res.render("pages/home.njk")
});

router.get("/room/:roomName", validateRoomAccess, (req, res) => {
  res.render("pages/room.njk")
});

export default router;