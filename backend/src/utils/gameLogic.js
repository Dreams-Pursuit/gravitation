"use strict";

const GRID_HEIGHT = 6;
const GRID_WIDTH = 6;


function advancedMode(rows,row, col) {
  for (let i = 1; i < GRID_HEIGHT; i++) {
    //The function is used for the "Advanced mode"
    for (let j = 0; j < GRID_WIDTH; j++) {
      //where you can put cross(X) or null(O) whereever you want
      if (
        (i != row || j != col) &&
        rows[i - 1][j] === "" &&
        rows[i][j] !== ""
      ) {
        //However in this case it will fall in case it has nothing
        [rows[i][j], rows[i - 1][j]] = [rows[i - 1][j], rows[i][j]]; //under it.
      }
    }
  }
  return rows;
}
function classicMode(row, col) {
  //function to validate index
  return row === "0" || rows[row - 1][col] !== "";
}

function winnerAlgo(rows) {
  //Horizontal matching check
  for (let row = 0; row < GRID_HEIGHT; row++) {
    let hitsHor = 1;
    for (let col = 1; col < GRID_WIDTH; col++) {
      if (rows[row][col] === rows[row][col - 1] && rows[row][col] !== "") {
        hitsHor++;
      } else hitsHor = 1;

      if (hitsHor === 4) {
        return { winner: rows[row][col] };
      }
    }
  }

  //Vertical matching check
  for (let col = 0; col < GRID_WIDTH; col++) {
    let hitsVer = 1;
    for (let row = 1; row < GRID_HEIGHT; row++) {
      if (rows[row][col] === rows[row - 1][col] && rows[row][col] !== "") {
        hitsVer++;
      } else hitsVer = 1;

      if (hitsVer === 4) {
        return { winner: rows[row][col] };
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
        hitsRD++;
      } else hitsRD = 1;

      if (hitsRD === 4) {
        return { winner: rows[row][c] };
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
        hitsLD++;
      } else hitsLD = 1;

      if (hitsLD === 4) {
        return { winner: rows[row][c] };
      }
    }
  }
  return { winner: false };
}

module.exports = {winnerAlgo, advancedMode};
