import gameInstance from "./Game.js";
import King from "../Pieces/King.js";
import Queen from "../Pieces/Queen.js";
import Pawn from "../Pieces/Pawn.js";

// Accessing the game board from the game instance
const board = gameInstance.board;

// Test case: Should create a two-dimensional array with the size of the board
it("Should create a two-dimensional array with the size of the board.", () => {
  const grid = board.grid;
  const generated = Array.from({ length: gameInstance.boardSize }, () =>
    Array(gameInstance.boardSize).fill(null),
  );

  // Assertion
  expect(grid).toEqual(generated);
});

// Test case: Shouldn't get anything if a position is on a false (non-existing) square
it("Shouldn't get anything if a position is on a false (non-exisiting) square.", () => {
  const position = { row: -1, col: 9 };

  // Retrieving a piece from the grid based on the position
  const pieceOnPosition = board.getPieceFromGrid(position);

  // Assertion
  expect(pieceOnPosition).toBeFalsy();
});

// Test case: Should set and get a piece
it("Should set and get a piece.", () => {
  const position = { row: 1, col: 1 };
  const king = new King(position, gameInstance.players.white, "white", "king");

  // Setting a piece on the grid
  board.setPieceFromGrid(king);

  // Retrieving a piece from the grid based on the position
  const pieceOnPosition = board.getPieceFromGrid(position);

  // Assertion
  expect(pieceOnPosition).toBe(king);
});

// Test case: Should return an array of pieces on the board
it("Should return an array of pieces on the board", () => {
  const pieces = [
    new King({ row: 1, col: 1 }, gameInstance.players.white, "white", "king"),
    new Queen({ row: 2, col: 1 }, gameInstance.players.white, "white", "king"),
    new King({ row: 3, col: 1 }, gameInstance.players.black, "black", "king"),
    new King({ row: 4, col: 1 }, gameInstance.players.black, "black", "king"),
    new Pawn({ row: 5, col: 1 }, gameInstance.players.black, "black", "king"),
  ];

  // Setting pieces on the grid
  pieces.forEach((piece) => board.setPieceFromGrid(piece));

  // Retrieving all pieces, black pieces, and white pieces from the grid
  const allPieces = board.getAllPiecesFromGrid();
  const blackPieces = board.getAllPiecesFromGrid("black");
  const whitePieces = board.getAllPiecesFromGrid("white");

  // Assertions
  expect(allPieces).toHaveLength(5);
  expect(blackPieces).toHaveLength(3);
  expect(whitePieces).toHaveLength(2);
});

// Test case: Should return an array of pieces from a FEN string
it("Should return an array of pieces from a FEN string.", () => {
  const fenString = "7k/8/8/8/8/8/8/K7 w - - 0 1";

  // Setting pieces on the grid from the FEN string
  board.setPiecesFromFen(fenString);

  // Assertions using instanceof checks
  expect(board.grid[0][0]).toBeInstanceOf(King);
  expect(board.grid[7][7]).toBeInstanceOf(King);
});
