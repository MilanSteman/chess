import gameInstance from './Game/Game.js';

const newGameButton = document.querySelector("#new-game");
const switchSideButton = document.querySelector("#switch-side");
const body = document.querySelector("body");

newGameButton.addEventListener("click", () => window.location.reload());

switchSideButton.addEventListener("click", () => {
  const chessboard = document.querySelector("article#chessboard");
  chessboard.classList.toggle("reversed");
  body.classList.toggle("reversed");
});

gameInstance.runGame();