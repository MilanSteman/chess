import pieceMap from '../Pieces/pieceMap.js';
import gameInstance from './Game.js';

export default class Board {
  constructor() {
    this.size = 8;
    this.fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

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
    return this.isPositionInBounds(destination) && this.grid[row][col];
  }

  setPieceFromGrid = (piece) => {
    const { row, col } = piece.position;
    return this.isPositionInBounds(piece.position) && (this.grid[row][col] = piece);
  }

  removePieceFromGrid = (piece) => {
    const { row, col } = piece.position;
    return this.isPositionInBounds(piece.position) && (this.grid[row][col] = null);
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
          const { player, Piece } = pieceMap.get(char);
          const position = { row, col };
          const generatedPiece = new Piece(position, gameInstance.players[player], Piece.name.toLowerCase());
          gameInstance.players[player].pieces.push(generatedPiece);
          this.setPieceFromGrid(generatedPiece);

          col++;
        }
      });
    });
  }
}