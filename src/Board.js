import React, { Component } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.25,
  };
  constructor(props) {
    super(props);

    this.state = { hasWon: false, board: this.createBoard() };
    // TODO: set initial state
    this.createBoard = this.createBoard.bind(this);
    this.makeTable = this.makeTable.bind(this);
    this.newGame = this.newGame.bind(this);
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];
    // TODO: create array-of-arrays of true/false values
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        row.push(Math.random() < this.props.chanceLightStartsOn);
      }
      board.push(row);
    }

    return board;
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }
    // TODO: flip this cell and the cells around it
    flipCell(y, x);
    flipCell(y, x - 1);
    flipCell(y - 1, x);
    flipCell(y + 1, x);
    flipCell(y, x + 1);

    // win when every cell is turned off
    // TODO: determine is the game has been won
    let w = board.every((row) => row.every((cell) => !cell));
    this.setState({ board: board, hasWon: w });
  }

  /** Render game board or winning message. */
  makeTable() {
    let tbl = [];
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        let coord = `${y}-${x}`;
        row.push(
          <Cell
            key={coord}
            coord={coord}
            isLit={this.state.board[y][x]}
            flipCellsAroundMe={() => this.flipCellsAround(coord)}
          />
        );
      }
      tbl.push(<tr key={y}>{row}</tr>);
    }
    return (
      <table className="Board">
        <tbody>{tbl}</tbody>
      </table>
    );
  }
  newGame() {
    this.setState((st) => ({ board: this.createBoard(), hasWon: false }));
  }
  render() {
    return (
      <div>
        {!this.state.hasWon ? (
          this.makeTable()
        ) : (
          <div>
            <h1>You Win!</h1>
            <button onClick={this.newGame}>New Game</button>
          </div>
        )}
      </div>
    );
  }
}

export default Board;
