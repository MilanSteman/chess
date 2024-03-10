// Importing necessary modules and enums
import { charMap } from "../misc/charMap.js";
import { isUpperCase } from "../misc/isUpperCase.js";
import { isPositionInBounds } from "../misc/isPositionInBounds.js";
import { Players } from "../enums/Players.js";
import { Tiles } from "../enums/Tiles.js";
import { getTileFromPosition } from "../misc/getTileFromPosition.js";
import { Game } from "./Game.js";
import { RevertableMixin } from "./mixins/Revertable.js";
/**
 * Represents the board of a chess game
 */
class Board {
    /**
     * Constructor for the Board class
     * Initializes the grid, DOM element, and sets hoveredTile to null
     */
    constructor() {
        // Creates a two-dimensional array representing the chess board
        Board.grid = new Array(Board.ROW_SIZE).fill(null).map(() => new Array(Board.COL_SIZE).fill(null));
        // Create the main HTML element for the chessboard
        Board.boardDomEl = document.createElement('div');
        // Initialize the chessboard by creating its tiles
        this.createBoard();
        Object.assign(this, RevertableMixin);
        Board.currentIndex = 0;
        // Set hoveredTile to null initially (default behavior)
        Board._hoveredTile = null;
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") {
                if (Board.currentIndex > 0) {
                    Board.revertBoardState(Board.currentIndex - 1);
                }
            }
            else if (e.key === "ArrowRight") {
                if (Board.currentIndex < (Game.move - 1)) {
                    Board.revertBoardState(Board.currentIndex + 1);
                }
            }
        });
    }
    /**
     * Getter for the static property _hoveredTile
     * @returns The currently hovered tile HTMLElement
     */
    static get hoveredTile() {
        return Board._hoveredTile;
    }
    /**
     * Setter for the static property _hoveredTile
     * @param newHoveredTile - The new tile to be set as hovered
     */
    static set hoveredTile(newHoveredTile) {
        // Remove highlight class from the previous hovered tile
        if (Board._hoveredTile) {
            Board._hoveredTile.classList.remove("hovered");
        }
        // Add highlight class to the new hovered tile (if exists)
        newHoveredTile ? newHoveredTile.classList.add("hovered") : null;
        // Update _hoveredTile to the new tile
        Board._hoveredTile = newHoveredTile;
    }
    /**
     * Creates the tiles on initialization based on the size of the board (grid)
     */
    createBoard() {
        // Append the correct class to the main HTML element
        Board.boardDomEl.classList.add("chessboard");
        // Create a fragment to batch append the rows and cols
        const fragment = document.createDocumentFragment();
        // Create rows and cols
        Board.grid.forEach((rows, row) => {
            const rowEl = document.createElement('div');
            rowEl.setAttribute("data-row", (Board.ROW_SIZE - row).toString());
            rows.forEach((_, col) => {
                const tile = document.createElement('div');
                // Add classes for styling and set tile data attribute
                tile.classList.add("tile");
                tile.classList.toggle(`${Tiles.LIGHT}-tile`, (row + col) % 2 === 0);
                tile.classList.toggle(`${Tiles.DARK}-tile`, (row + col) % 2 === 1);
                tile.setAttribute("data-tile", getTileFromPosition(row, col));
                rowEl.appendChild(tile);
            });
            fragment.appendChild(rowEl);
        });
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('viewBox', '0 0 8 8');
        svg.style.position = "absolute";
        svg.style.pointerEvents = "none";
        svg.classList.add("arrows");
        fragment.appendChild(svg);
        // Append the row to the chessboard
        Board.boardDomEl.appendChild(fragment);
    }
    /**
     * Sets a position from a FEN string on the chessboard
     */
    setPosition(position) {
        // Extract the relevant part of the FEN string
        const positionStr = position.split(' ')[0];
        const rows = positionStr.split('/');
        // Loop over each row in the FEN string
        rows.forEach((chars, row) => {
            let col = 0;
            // Loop over each character in the row
            Array.from(chars).forEach((char) => {
                // Check if the character is a number, skip that number of steps
                if (!isNaN(parseInt(char))) {
                    col += parseInt(char);
                    return;
                }
                // Set the piece on the grid if it has the correct notation
                const PieceType = charMap.get(char.toLowerCase());
                if (PieceType && isPositionInBounds(row, col, Board.SIZE)) {
                    // Determine the color of the piece based on the notation (uppercase for white, lowercase for black)
                    const color = isUpperCase(char) ? Players.WHITE : Players.BLACK;
                    // Create a new piece and set it on the grid
                    const piece = new PieceType(PieceType.name.toLowerCase(), color, row, col);
                    Board.grid[row][col] = piece;
                    col++;
                }
            });
        });
    }
    /**
     * Reverts the board state to a specific move index
     */
    static revertBoardState(moveIndex = (Game.move - 1)) {
        RevertableMixin.revertBoardState(moveIndex);
    }
    /**
     * Highlights the from and to tiles of a move
     */
    static highlightMovePositions(move) {
        // Remove previously highlighted tile
        document.querySelectorAll(".highlighted").forEach((highlightedTile) => {
            highlightedTile.classList.remove("highlighted");
        });
        // Highlight the "from" and "to" tiles directly
        function highlightTile(row, col) {
            const tile = document.querySelector(`div.tile[data-tile="${getTileFromPosition(row, col)}"]`);
            tile === null || tile === void 0 ? void 0 : tile.classList.add("highlighted");
        }
        highlightTile(move.fromRow, move.fromCol);
        if (typeof move.toRow !== 'undefined' && typeof move.toCol !== 'undefined') {
            highlightTile(move.toRow, move.toCol);
        }
    }
}
Board.SIZE = 8;
Board.ROW_SIZE = Board.SIZE;
Board.COL_SIZE = Board.SIZE;
Board._hoveredTile = null;
export { Board };
