import pieceMap from '../misc/pieceMap.js';
import gameInstance from './Game.js';

export default class Board {
  constructor() {
    this.size = 8;
    this.fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    this.duplicateGrid = [];

    const createGrid = () => {
      return Array.from({ length: this.size }, () => {
        return Array.from({ length: this.size }).fill(null);
      });
    }

    this.grid = createGrid();
  }

  isPositionInBounds = (position) => {
    const { row, col } = position;
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  getPieceFromGrid = (position) => {
    const { row, col } = position;
    return this.isPositionInBounds(position) && this.grid[row][col];
  }

  getAllPiecesFromGrid = (filter) => {
    return this.grid.flatMap(row => row.filter(obj => obj && obj.color === filter));
  }

  setPieceFromGrid = (piece) => {
    const { row, col } = piece._position;
    return this.isPositionInBounds(piece._position) && (this.grid[row][col] = piece);
  }

  removePieceFromGrid = (piece) => {
    const { row, col } = piece._position;
    return this.isPositionInBounds(piece._position) && (this.grid[row][col] = null);
  }

  initializePieceInGrid = (char, position) => {
    const { player, Piece } = pieceMap.get(char);
    const generatedPiece = new Piece(position, gameInstance.players[player], Piece.name.toLowerCase());
    gameInstance.players[player].pieces.push(generatedPiece);
    this.setPieceFromGrid(generatedPiece, gameInstance.board.grid);
  }

  setPiecesFromFen = () => {
    const rows = this.fenString.split(" ")[0].split("/").reverse();

    rows.forEach((item, row) => {
      let col = 0;

      [...item].forEach((char) => {
        if (!isNaN(parseInt(char))) {
          col += parseInt(char);
        }

        if (pieceMap.has(char)) {
          const position = { row, col };
          this.initializePieceInGrid(char, position)

          col++;
        }
      });
    });
  }
}