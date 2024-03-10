import client from "./client.js";
const queueButton = document.querySelector("button#match");
queueButton === null || queueButton === void 0 ? void 0 : queueButton.addEventListener("click", () => {
    client.socket.emit("startQueue");
});
