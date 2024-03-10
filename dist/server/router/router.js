"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRoomAccess_1 = require("../misc/functions/validateRoomAccess");
const router = (0, express_1.Router)();
router.get("/", validateRoomAccess_1.redirectIfInRoom, (req, res) => {
    res.render("pages/home.njk");
});
router.get("/room/:roomName", validateRoomAccess_1.validateRoomAccess, (req, res) => {
    res.render("pages/room.njk");
});
exports.default = router;
//# sourceMappingURL=router.js.map