/**
 * @jest-environment jsdom
 */

import Game from "./Game.js";

it("Should run the game and check if pieces are automatically added.", () => {
  const game = new Game();
  game.runGame();

  const pieces = game.board.getAllPiecesFromGrid();

  // Expectation on run game should be greater than 0.
  expect(pieces.length).toBeGreaterThan(0);
});

// Test case: Should switch active player correctly.
it("Should switch active player correctly.", () => {
  // Creating a new instance of the Game class.
  const game = new Game();

  // Running the game logic.
  game.runGame();

  // Expectation that the initial active player to be the white player.
  expect(game.currentPlayer).toBe(game.players.white);

  // Switching the active player to black.
  game.switchCurrentPlayer();

  // Expectation that the active player to be the black player.
  expect(game.currentPlayer).toBe(game.players.black);

  // Switching the active player back to white.
  game.switchCurrentPlayer();

  // Expectation that the active player to be the white player again.
  expect(game.currentPlayer).toBe(game.players.white);
});

// Describe block for handling game state detects.
describe("Handling game state detects", () => {
  let game;

  // Before each test, creating a new instance of the Game class.
  beforeEach(() => {
    game = new Game();
  });

  // Test case: Checkmate detection.
  it("Checkmate", () => {
    // Setting up a specific FEN string for checkmate scenario.
    game.fenString = "7k/5Q2/5K2/8/8/8/8/8 w - - 0 1";

    // Running the game logic.
    game.runGame();

    // Moving the white queen to create a checkmate.
    const whiteQueen = game.board.getPieceFromGrid({ row: 6, col: 5 });
    whiteQueen.moveToTile({ row: 6, col: 6 });

    // Expectation game over, winner is white, and checkmate occurred.
    expect(game.state.gameOver).toBe(true);
    expect(game.state.winner.color).toBe("white");
    expect(game.state.winType.checkmate).toBe(true);
  });

  // Test case: Stalemate detection.
  it("Stalemate", () => {
    // Setting up a specific FEN string for stalemate scenario.
    game.fenString = "7k/8/5QK1/8/8/8/8/8 w - - 0 1";

    // Running the game logic.
    game.runGame();

    // Moving the white queen to create a stalemate.
    const whiteQueen = game.board.getPieceFromGrid({ row: 5, col: 5 });
    whiteQueen.moveToTile({ row: 6, col: 5 });

    // Expectation game over, no winner, and stalemate occurred.
    expect(game.state.gameOver).toBe(true);
    expect(game.state.winner).toBeNull();
    expect(game.state.winType.stalemate).toBe(true);
  });

  // Test case: Insufficient Material detection.
  it("Insufficient Material", () => {
    // Setting up a specific FEN string for insufficient material scenario.
    game.fenString = "8/8/8/8/2k5/8/1n6/K7 w - - 0 1";

    // Running the game logic.
    game.runGame();

    // Moving the white king to create insufficient material scenario.
    const whiteKing = game.board.getPieceFromGrid({ row: 0, col: 0 });
    whiteKing.moveToTile({ row: 1, col: 1 });

    // Expectation game over, no winner, and insufficient material occurred.
    expect(game.state.gameOver).toBe(true);
    expect(game.state.winner).toBeNull();
    expect(game.state.winType.insufficientMaterial).toBe(true);
  });
});
