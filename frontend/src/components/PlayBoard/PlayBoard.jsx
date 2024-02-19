import React, { useState } from "react";
import { GRID_HEIGHT, GRID_WIDTH } from "../../functions/constants";
import "../../css/PlayBoard.css";


function PlayBoard({ hasGameStarted ,setGameStarted, isOfflineMode }) {
  const [rows, setRows] = React.useState(generateEmptyCellValues()); // Find a more efficient way
  const [currentPlayer, setCurrentPlayer] = React.useState("X");
  const [gameEnded, setGameEnded] = React.useState(false);
  const [time, setTime] = useState(1000);
  const [winner, setWinner] = useState("");

  function generateEmptyCellValues() {
    const rows = new Array(GRID_HEIGHT)
      .fill(0)
      .map((elem) => new Array(GRID_WIDTH).fill(""));
    return rows;
  }

  function resetHandler(e) {
    e.preventDefault();
    setRows(generateEmptyCellValues());
    setCurrentPlayer("X");
    setGameEnded(false);
    setTime(1000);
    document.querySelectorAll(".board-cell").forEach((cell) => {
      cell.innerHTML = "";
    });
  }

  function advancedMode(row, col) {
    for (let i = 0; i < GRID_HEIGHT - 1; i++) {
      //The function is used for the "Advanced mode"
      for (let j = 0; j < GRID_WIDTH; j++) {
        //where you can put cross(X) or null(O) whereever you want
        if (i !== row && j !== col && rows[i][j] === "" && rows[i + 1][j] !== "")
          //However in this case it will fall in case it has nothing
          [rows[i][j], rows[i + 1][j]] = [rows[i + 1][j], rows[i][j]]; //under it.
      }
    }
    return rows;
  }
  function classicMode(row, col) {
    //function to validate index
    if (row === "0") return true;
    else return rows[row - 1][col] !== "";
  }

  function isThereAWinner() {
    //Horizontal matching check
    console.log(rows);
    for (let row = 0; row < GRID_HEIGHT; row++) {
      let hitsHor = 1;
      for (let col = 1; col < GRID_WIDTH; col++) {
        if (rows[row][col] === rows[row][col - 1] && rows[row][col] !== "") {
          hitsHor++;
          //console.log(`Horizontal:[${row},${col}],${rows[row][col]} ${hitsHor}`)
        } else hitsHor = 1;

        if (hitsHor === 4) {
          console.log(`The player ${rows[row][col]} won! Congratulations.`);
          setWinner(rows[row][col]);
          return true;
        }
      }
    }

    //Vertical matching check
    for (let col = 0; col < GRID_WIDTH; col++) {
      let hitsVer = 1;
      for (let row = 1; row < GRID_HEIGHT; row++) {
        if (rows[row][col] === rows[row - 1][col] && rows[row][col] !== "") {
          hitsVer++;
          //console.log(`Vertical:[${row},${col}], ${rows[row][col]} ${hitsVer}`);
        } else hitsVer = 1;

        if (hitsVer === 4) {
          console.log(`The player ${rows[row][col]} won! Congratulations.`);
          setWinner(rows[row][col]);
          return true;
        }
      }
    }
    //Diagonal check
    for (let c = 0; c < GRID_WIDTH; c++) {
      let hitsRD = 1;
      for (let row = 1; row < GRID_HEIGHT; row++) {
        if (
          rows[row][(row + c) % GRID_WIDTH] ===
            rows[row - 1][((row + c) % GRID_WIDTH) - 1] &&
          rows[row][(row + c) % GRID_WIDTH] !== ""
        ) {
          console.log(
            `right diagonal hit [${row},${(row + c) % GRID_WIDTH}] ${
              rows[row][(row + c) % GRID_WIDTH]
            }`
          );
          hitsRD++;
        } else hitsRD = 1;

        if (hitsRD === 4) {
          console.log(
            `The player ${
              rows[row][(row + c) % GRID_WIDTH]
            } won! Congratulations`
          );
          setWinner(rows[row][(row + c) % GRID_WIDTH]);
          return true;
        }
      }
    }
    //Antidiagonal check
    for (let c = 0; c < GRID_WIDTH; c++) {
      let hitsLD = 1;
      for (let row = 1; row < GRID_HEIGHT; row++) {
        if (
          rows[row][(GRID_WIDTH - 1 - row + c) % GRID_WIDTH] ===
              rows[row - 1][(GRID_WIDTH - row + c) % GRID_WIDTH] &&
              rows[row][(GRID_WIDTH - 1 - row + c) % GRID_WIDTH] !== ""
        ) {
          console.log(
            `left diagonal hit [${row},${(GRID_WIDTH - 1 - row + c) % GRID_WIDTH}] ${
              rows[row][(GRID_WIDTH - 1 - row + c) % GRID_WIDTH]
            }`
          );
          hitsLD++;
        } else hitsLD = 1;

        if (hitsLD === 4) {
          console.log(
            `The player ${
              rows[row][(GRID_WIDTH - 1 - row + c) % GRID_WIDTH]
            } won! Congratulations`
          );
          setWinner(rows[row][(GRID_WIDTH - 1 - row + c) % GRID_WIDTH]);
          return true;
        }
      }
    }
    return false;
  }

  function cellHandler(cell) {
    const newRows = rows;
    const row = cell.target.getAttribute("data-row_index");
    const col = cell.target.getAttribute("data-col_index");

    if (!cell.target.innerHTML && !gameEnded) {
      if (classicMode(row, col)) {
        cell.target.innerHTML = currentPlayer;
        rows[row][col] = currentPlayer;
      } else {
        console.log(
          `Impossoble to put ${currentPlayer} here - not a based field!`
        );
        return;
      }
      if (!hasGameStarted) setHasGameStarted(true);
      if (isThereAWinner()) {
        setGameEnded(true);
      } else {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
        if (isOfflineMode) setTime(100000);
        else setTime(1000);
      }
    }
    console.log("Clicked: [" + row + "," + col + "]");
    setRows(newRows);
    console.log(rows);
  }
  function generateGrid() {
    return rows.map((row, rowIndex) =>
      row.map((cell, cellIndex) => (
        <div
          key={"row-" + rowIndex + "_col-" + cellIndex}
          data-row_index={rowIndex}
          data-col_index={cellIndex}
          className="board-cell"
          onClick={cellHandler}
        >
          {cell}
        </div>
      ))
    );
  }

  React.useEffect(() => {
    let intervalId;
    if (!rows) {
      console.log("Entered");
      setRows(generateEmptyCellValues());
    }
    if (hasGameStarted) {
      if (time === 0) {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
        setTime(1000);
      }
      intervalId = setInterval(() => {
        setTime(time - 1);
      }, 10);
    }

    if (gameEnded) {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [rows, hasGameStarted, time]);

  function closeThePlayBoard() {
    alert("You have given up, bruuhh! The winner is " + currentPlayer);
    setGameStarted(false);
  }

  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  return (
    <div className="playboard-component">
      <div className="time-elapsed-stat">
        <h3>
          Time left: {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}:
          {milliseconds.toString().padStart(2, "0")}
        </h3>
      </div>
      <div className="close-button">
        <button onClick={closeThePlayBoard}>Give up</button>
      </div>
      <div>
        {gameEnded ? (
          <h3>The winner - {winner}!</h3>
        ) : (
          <h3>Your turn: {currentPlayer}</h3>
        )}
      </div>
      <div className="interface-wrapper">
        <div className="board-field">{generateGrid().reverse()}</div>
        <div className="board-control">
          <div className="buttons-wrapper">
            <button onClick={resetHandler}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayBoard;
