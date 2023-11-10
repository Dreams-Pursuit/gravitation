import React, { useState } from "react";
import "../../css/PlayBoard.css";

const GRID_HEIGHT = 6;
const GRID_WIDTH = 6;

function PlayBoard() {
  const [rows, setRows] = React.useState(generateEmptyCellValues()); // Find a more efficient way
  const [currentPlayer, setCurrentPlayer] = React.useState("X");
  const [gameEnded, setGameEnded] = React.useState(false);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [time, setTime] = useState(0);
  let isCirclePlaying = false;

  function generateEmptyCellValues() {
    const rows = [];
    for (let i = 0; i < GRID_HEIGHT * GRID_WIDTH; i++) {
      rows.push("");
    }
    return rows;
  }

  function resetHandler(e) {
    e.preventDefault();
    setRows(generateEmptyCellValues());
    setCurrentPlayer("X");
    setGameEnded(false);

    document.querySelectorAll(".board-cell").forEach((cell) => {
      cell.innerHTML = "";
    });
  }

  function isValidIndex(index) {
    if (index < GRID_WIDTH) return true;

    return rows[index - GRID_WIDTH] ? true : false;
  }

  function twoDimToOneDimCoords(row, column) {
    return row * GRID_WIDTH + column;
  }

  function isThereAWinner() {
    //HorizontalCheck
    let hitsHorizontal = 1;
    let hitsVertical = 1;
    let hitsDiagonalLeft = 1;
    let hitsDiagonalRight = 1;

    let currentIndex;

    for (let r = 0; r < GRID_HEIGHT; r++) {
      hitsHorizontal = 1;

      for (let c = 1; c < GRID_WIDTH; c++) {
        currentIndex = r * GRID_WIDTH + c;

        const prevHor = rows[currentIndex - 1];

        //Horizontal check
        if (prevHor === rows[currentIndex] && prevHor !== "") {
          console.log(`Horizontal hit ${hitsHorizontal}. Symbol ${prevHor}. Row: ${r}. Column: ${c}`);
          hitsHorizontal++;
          if (hitsHorizontal === 4) { 
            console.log("Winner winner chicken dinner");
            return true; 
          }
        } else {
          hitsHorizontal = 1;
        }
        
        //Vertical check
        for (let i = 1; i < GRID_HEIGHT; i++) {
          let index = i * GRID_WIDTH + c;
          const prev = rows[index - GRID_WIDTH];
          if (prev === rows[index] && prev !== "") {
            console.log(`Vertical hit ${hitsVertical}. Symbol ${prev}. Row: ${r}. Column: ${c}`);
            hitsVertical++;
            if (hitsVertical === 4) { 
              console.log("Winner winner chicken dinner");
              return true; 
            }
          } else {
            hitsVertical = 1;
          }
        }

        //Diagonal right 
        // for (let i = 1, j = c + 1; i < GRID_HEIGHT && j < GRID_WIDTH; i++, j++) {
        //   let index = i * GRID_WIDTH + j;
        //   const prev = rows[index - GRID_WIDTH - 1];

        //   if (prev != "" && rows[index] != "") {
        //     console.log(`Prev. Row: ${i - 1}. Column: ${j - 1}. Symbol ${prev}`);
        //     console.log(`Current. Row: ${i}. Column: ${j}. Symbol ${rows[index]}`);
        //   }

        //   if (prev === rows[index] && prev != "") {
        //     console.log(`Diag hit ${hitsDiagonalRight}. Symbol ${prev}. Row: ${r}. Column: ${c}`);
        //     hitsDiagonalRight++;
        //     if (hitsDiagonalRight === 4) { 
        //       console.log("Winner winner chicken dinner");
        //       return true; 
        //     }
        //   } else {
        //     hitsDiagonalRight = 1;
        //   }
        // }
      }
    }
    // setGameEnded(true);
    return false;
  }

  function cellHandler(e) {
    const newRows = rows;
    const index = e.target.getAttribute("data-index");

    if (!hasGameStarted) setHasGameStarted(true);

    if (!e.target.innerHTML && isValidIndex(index) && !gameEnded) {
      e.target.innerHTML = currentPlayer;
      rows[index] = currentPlayer;

      isCirclePlaying = !isCirclePlaying;
      setCurrentPlayer((currentPlayer === "X") ? "O" : "X");

      if (isThereAWinner()) {
        setGameEnded(true);
      }
    }
    // setCurrentPlayer(isCirclePlaying ? "O" : "X"); //Causes the bug
    // console.log(twoDimToOneDimCoords(2, 2))
    console.log("Clicked: " + index);
    setRows(newRows);
    console.log(rows);
  }

  function generateGrid() {
    return rows.map((element, index, array) => {
      // console.log("Index - " + index + " element: " + element);
      return (
        <div
          key={"cell-" + (index)}
          data-index={index} //Fix here to not duplicate data 
          className="board-cell"
          onClick={cellHandler}
        >
          {element}
        </div>
      );
    });
  }

  React.useEffect(() => {
    let intervalId;
    if (!rows) {
      console.log("Entered");
      setRows(generateEmptyCellValues());
    }
    if (hasGameStarted) {
      intervalId = setInterval(() => { setTime(time + 1); }, 10);
    }

    return () => {
      clearInterval(intervalId);
    }
  }, [rows, hasGameStarted, time]);

  const hours = Math.floor(time / 360000);
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  return (
    <div className="playboard-component">
      <div className="time-elapsed-stat">
        <h3>Time elapsed: {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}:{milliseconds.toString().padStart(2, "0")}</h3>
      </div>
      <div>
        {gameEnded 
        ? <h3>The winner - {(currentPlayer === "X") ? "O" : "X"}!</h3>
        : <h3>Your turn: {currentPlayer}</h3>}
      </div>
      <div className="interface-wrapper">
        <div className="board-field">{generateGrid()}</div>
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
