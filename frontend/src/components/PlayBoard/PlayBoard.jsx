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
    setTime(0);
    document.querySelectorAll(".board-cell").forEach((cell) => {
      cell.innerHTML = "";
    });
  }

  function advancedMode(row, col) {
    for(let i = 0; i < GRID_HEIGHT - 1; i++){                         //The function is used for the "Advanced mode"
      for(let j = 0; j < GRID_WIDTH; j++){                       //where you can put cross(X) or null(O) whereever you want
        if((i != row && j != col) && rows[i][j] == "" && rows[i + 1][j] != "")                  //However in this case it will fall in case it has nothing
          [rows[i][j], rows[i + 1][j]] = [rows[i + 1][j], rows[i][j]];//under it.
      }
    }
    return rows;
  }
  function classicMode(row, col){ //function to validate index
    if(row == 0)
      return true;
    else
      return rows[row - 1][col] !== "";
  }

  function isThereAWinner() {
    let hitsHor = 1,
      hitsVer = 1,
      hitsRD = 1,
      hitsLD = 1;
    //Horizontal matching check
    console.log(rows);
    for (let row = 0; row < GRID_HEIGHT; row++) {
      hitsHor = 1;
      for (let col = 1; col < GRID_WIDTH; col++) {
        if (rows[row][col] === rows[row][col - 1] && rows[row][col] != "") {
          hitsHor++;
          console.log(`Horizontal:[${row},${col}],${rows[row][col]} ${hitsHor}`)
        }else hitsHor = 1;

        if (hitsHor == 4) {
          console.log(`The player ${rows[row][col]} won! Congratulations.`);
          return true;
        }
      }
    }

    //Vertical matching check
    for (let col = 0; col < GRID_WIDTH; col++) {
      hitsVer = 1;
      for (let row = 1; row < GRID_HEIGHT; row++) {
        if (rows[row][col] == rows[row - 1][col] && rows[row][col] != "") {
          hitsVer++;
          console.log(`Vertical:[${row},${col}], ${rows[row][col]} ${hitsVer}`);
        }else hitsVer = 1;

        if (hitsVer == 4) {
          console.log(`The player ${rows[row][col]} won! Congratulations.`);
          return true;
        }
      }
    }
  }

  // function isThereAWinner() {
  //   //HorizontalCheck
  //   let hitsHorizontal = 1;
  //   let hitsVertical = 1;
  //   let hitsDiagonalLeft = 1;
  //   let hitsDiagonalRight = 1;

  //   let currentIndex;

  //   for (let r = 0; r < GRID_HEIGHT; r++) {
  //     hitsHorizontal = 1;

  //     for (let c = 1; c < GRID_WIDTH; c++) {
  //       currentIndex = r * GRID_WIDTH + c;

  //       const prevHor = rows[currentIndex - 1];

  //       //Horizontal check
  //       if (prevHor === rows[currentIndex] && prevHor !== "") {
  //         console.log(`Horizontal hit ${hitsHorizontal}. Symbol ${prevHor}. Row: ${r}. Column: ${c}`);
  //         hitsHorizontal++;
  //         if (hitsHorizontal === 4) {
  //           console.log("Winner winner chicken dinner");
  //           return true;
  //         }
  //       } else {
  //         hitsHorizontal = 1;
  //       }

  //       //Vertical check
  //       for (let i = 1; i < GRID_HEIGHT; i++) {
  //         let index = i * GRID_WIDTH + c;
  //         const prev = rows[index - GRID_WIDTH];
  //         if (prev === rows[index] && prev !== "") {
  //           console.log(`Vertical hit ${hitsVertical}. Symbol ${prev}. Row: ${r}. Column: ${c}`);
  //           hitsVertical++;
  //           if (hitsVertical === 4) {
  //             console.log("Winner winner chicken dinner");
  //             return true;
  //           }
  //         } else {
  //           hitsVertical = 1;
  //         }
  //       }

  //       //Diagonal right
  //       // for (let i = 1, j = c + 1; i < GRID_HEIGHT && j < GRID_WIDTH; i++, j++) {
  //       //   let index = i * GRID_WIDTH + j;
  //       //   const prev = rows[index - GRID_WIDTH - 1];

  //       //   if (prev != "" && rows[index] != "") {
  //       //     console.log(`Prev. Row: ${i - 1}. Column: ${j - 1}. Symbol ${prev}`);
  //       //     console.log(`Current. Row: ${i}. Column: ${j}. Symbol ${rows[index]}`);
  //       //   }

  //       //   if (prev === rows[index] && prev != "") {
  //       //     console.log(`Diag hit ${hitsDiagonalRight}. Symbol ${prev}. Row: ${r}. Column: ${c}`);
  //       //     hitsDiagonalRight++;
  //       //     if (hitsDiagonalRight === 4) {
  //       //       console.log("Winner winner chicken dinner");
  //       //       return true;
  //       //     }
  //       //   } else {
  //       //     hitsDiagonalRight = 1;
  //       //   }
  //       // }
  //     }
  //   }
  //   // setGameEnded(true);
  //   return false;
  // }

  function cellHandler(cell) {
    const newRows = rows;
    //const index = e.target.getAttribute("data-index");
    const row = cell.target.getAttribute("data-row_index");
    const col = cell.target.getAttribute("data-col_index");
    // const row = Math.floor(index / GRID_WIDTH); //Transformation from 1D to 2D coordinates
    // const col = index % GRID_WIDTH;

    if (!hasGameStarted) setHasGameStarted(true);

    if (!cell.target.innerHTML && !gameEnded) {
      if(classicMode(row,col)){
        cell.target.innerHTML = currentPlayer;
        rows[row][col] = currentPlayer;
      }else{
        console.log(`Impossoble to put ${currentPlayer} here - not a based field!`);
        return;
      }

      isCirclePlaying = !isCirclePlaying;
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");

      if (isThereAWinner()) {
        setGameEnded(true);
      }
    }
    // setCurrentPlayer(isCirclePlaying ? "O" : "X"); //Causes the bug
    // console.log(twoDimToOneDimCoords(2, 2))
    console.log("Clicked: [" + row + "," + col + "]");
    setRows(newRows);
    console.log(rows);
  }
  function generateGrid() {
    return rows.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        return (
          <div
            key={"row-" + rowIndex + "_col-" + cellIndex}
            data-row_index={rowIndex}
            data-col_index={cellIndex}
            className="board-cell"
            onClick={cellHandler}
          >
            {cell}
          </div>
        );
      })
    );
  }

  // function generateGrid() {
  //   return rows.map((element, index, array) => {
  //     // console.log("Index - " + index + " element: " + element);
  //     return (
  //       <div
  //         key={"cell-" + (index)}
  //         data-index={index} //Fix here to not duplicate data
  //         className="board-cell"
  //         onClick={cellHandler}
  //       >
  //         {element}
  //       </div>
  //     );
  //   });
  // }

  React.useEffect(() => {
    let intervalId;
    if (!rows) {
      console.log("Entered");
      setRows(generateEmptyCellValues());
    }
    if (hasGameStarted) {
      intervalId = setInterval(() => {
        setTime(time + 1);
      }, 10);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [rows, hasGameStarted, time]);

  //const hours = Math.floor(time / 360000);
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
      <div>
        {gameEnded ? (
          <h3>The winner - {currentPlayer === "X" ? "O" : "X"}!</h3>
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
