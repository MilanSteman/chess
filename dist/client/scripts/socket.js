"use strict";
var _a;
const socket = io();
(_a = document.querySelector("button#match")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    console.log('clicked');
    socket.emit("queueGame");
});
