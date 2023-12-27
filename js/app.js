import gameInstance from './Game/Game.js';

// Get references to HTML elements
const newGameButton = document.querySelector("#new-game");
const switchSideButton = document.querySelector("#switch-side");
const body = document.querySelector("body");

// Event listener for the 'New Game' button
newGameButton.addEventListener("click", () => window.location.reload());

// Event listener for the 'Switch Side' button
switchSideButton.addEventListener("click", () => {
  // Toggle the 'reversed' class on the chessboard and body elements
  const chessboard = document.querySelector("article#chessboard");
  chessboard.classList.toggle("reversed");
  body.classList.toggle("reversed");
});

// Run the game when the page loads
gameInstance.runGame();