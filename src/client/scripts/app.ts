import client from "./client.js";

const queueButton: HTMLButtonElement | null = document.querySelector("button#match");

queueButton?.addEventListener("click", () => {
  client.socket.emit("startQueue");
});