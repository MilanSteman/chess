import Game from "./Game.js";
import King from "../Pieces/King.js";
import Queen from "../Pieces/Queen.js";
import Pawn from "../Pieces/Pawn.js";

// Test case: Should create a two-dimensional array with the size of the board.
it("Should create a two-dimensional array with the size of the board.", () => {
  const game = new Game();
  // Accessing the grid property from the game board.
  const grid = game.board.grid;

  // Generating an expected two-dimensional array based on the board size.
  const generated = Array.from({ length: game.boardSize }, () =>
    Array(game.boardSize).fill(null),
  );

  // Expectation: Checking if the grid matches the generated array.
  expect(grid).toEqual(generated);
});

// Test case: Shouldn't get anything if a position is on a false (non-existing) square.
it("Shouldn't get anything if a position is on a false (non-existing) square.", () => {
  const game = new Game();

  // Specifying an invalid position.
  const position = { row: -1, col: 9 };

  // Retrieving a piece from the grid based on the invalid position.
  const pieceOnPosition = game.board.getPieceFromGrid(position);

  // Expectation: Expecting no piece to be retrieved.
  expect(pieceOnPosition).toBeFalsy();
});

// Test case: Should set, get, and remove a piece.
it("Should set, get, and remove a piece.", () => {
  const game = new Game();

  // Specifying a position for the new piece.
  const position = { row: 1, col: 1 };
  // Creating a new King instance with specified attributes.
  const king = new King(position, game.players.white, "white", "king");

  // Setting the king piece on the grid.
  game.board.setPieceFromGrid(king);

  // Retrieving the piece from the grid based on the position.
  const pieceOnPosition = game.board.getPieceFromGrid(position);

  // Expectation after adding a piece: Checking if the retrieved piece is an instance of King.
  expect(pieceOnPosition).toBeInstanceOf(King);

  // Removing the piece from the grid after the first expectation.
  game.board.removePieceFromGrid(king);

  // Retrieving a piece from the position after removing: Expecting no piece to be retrieved.
  const removedPieceOnPosition = game.board.getPieceFromGrid(position);

  // Expectation after removing a piece: Checking if no piece is retrieved from the position.
  expect(removedPieceOnPosition).toBeNull();
});

// Test case: Should return an array of pieces on the board.
it("Should return an array of pieces on the board", () => {
  const game = new Game();

  // Creating an array of pieces.
  const pieces = [
    new King({ row: 1, col: 1 }, game.players.white, "king", game),
    new Queen({ row: 2, col: 1 }, game.players.white, "queen", game),
    new King({ row: 3, col: 1 }, game.players.black, "king", game),
    new Queen({ row: 4, col: 1 }, game.players.black, "queen", game),
    new Pawn({ row: 5, col: 1 }, game.players.black, "pawn", game),
  ];

  // Setting the specified pieces on the grid.
  pieces.forEach((piece) => game.board.setPieceFromGrid(piece));

  // Retrieving all pieces, black pieces, and white pieces from the grid.
  const allPieces = game.board.getAllPiecesFromGrid();
  const whitePieces = game.board.getAllPiecesFromGrid("white");
  const blackPieces = game.board.getAllPiecesFromGrid("black");

  // Expectations: Checking the lengths of the retrieved arrays.
  expect(allPieces).toHaveLength(5);
  expect(blackPieces).toHaveLength(3);
  expect(whitePieces).toHaveLength(2);
});

// Test case: Should return an array of pieces from a FEN string.
it("Should return an array of pieces from a FEN string.", () => {
  const game = new Game("7k/8/8/8/8/8/8/K7 w - - 0 1");

  // Setting pieces on the grid based on the provided FEN string.
  game.board.setPiecesFromFen(game.fenString);

  // Expectations: Checking if specific positions on the grid contain instances of King.
  expect(game.board.grid[0][0]).toBeInstanceOf(King);
  expect(game.board.grid[7][7]).toBeInstanceOf(King);
});
