import { useEffect ,useState } from "react";
import { GRID_HEIGHT, GRID_WIDTH } from "../../functions/constants";
import "../../css/PlayBoard.css";

let randomPlayerValue = Math.random();
function PlayBoard({ setAppState, config }) {
  const playerSymbols = {};
  getRandomPlayer(playerSymbols);
  const [gameStage, setGameStage] = useState("Paused");
  const [rows, setRows] = useState(generateEmptyCellValues()); // Find a more efficient way
  const [currentPlayer, setCurrentPlayer] = useState(playerSymbols.X);
  const [time, setTime] = useState(config.timerValue);
  const [winner, setWinner] = useState("");

  function generateEmptyCellValues() {
    const rows = new Array(GRID_HEIGHT)
      .fill(0)
      .map((elem) => new Array(GRID_WIDTH).fill(""));
    return rows;
  }

  function getRandomPlayer(obj){
      obj[config.firstPlayer] = (randomPlayerValue < 0.5 ? "X" : "O");
      obj.X = (randomPlayerValue < 0.5 ? config.firstPlayer : config.secondPlayer);
      obj[config.secondPlayer] = (randomPlayerValue < 0.5 ?  "O" : "X");
      obj.O = (randomPlayerValue < 0.5 ? config.secondPlayer : config.firstPlayer);
  }

  function resetHandler(e) {
    e.preventDefault();
    setRows(generateEmptyCellValues());
    randomPlayerValue = Math.random();
    console.log(randomPlayerValue);
    getRandomPlayer(playerSymbols);
    console.log(playerSymbols);
    setCurrentPlayer(playerSymbols.X);
    setGameStage("Paused");
    setTime(config.timerValue);
    document.querySelectorAll(".board-cell").forEach((cell) => {
      cell.innerHTML = "";
    });
  }

  function advancedMode(row, col) {
    console.log(rows);
    for (let i = 1; i < GRID_HEIGHT; i++) {
      //The function is used for the "Advanced mode"
      for (let j = 0; j < GRID_WIDTH; j++) {
        //where you can put cross(X) or null(O) whereever you want
        if ((i != row || j != col) && rows[i - 1][j] === "" && rows[i][j] !== ""){
          //However in this case it will fall in case it has nothing
          [rows[i][j], rows[i - 1][j]] = [rows[i - 1][j], rows[i][j]]; //under it.
          [document.getElementById("row-" + (i - 1) + "_col-" + j).innerHTML , document.getElementById("row-" + i + "_col-" + j).innerHTML] = [document.getElementById("row-" + i + "_col-" + j).innerHTML, document.getElementById("row-" + (i - 1) + "_col-" + j).innerHTML];
        }
      }
    }
    return rows;
  }
  function classicMode(row, col) {
    //function to validate index
    return row === "0" || rows[row - 1][col] !== "";
  }

  function isThereAWinner() {
    //Horizontal matching check
    for (let row = 0; row < GRID_HEIGHT; row++) {
      let hitsHor = 1;
      for (let col = 1; col < GRID_WIDTH; col++) {
        if (rows[row][col] === rows[row][col - 1] && rows[row][col] !== "") {
          hitsHor++;
        } else hitsHor = 1;

        if (hitsHor === 4) {
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
        } else hitsVer = 1;

        if (hitsVer === 4) {
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
          hitsRD++;
        } else hitsRD = 1;

        if (hitsRD === 4) {
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
          hitsLD++;
        } else hitsLD = 1;

        if (hitsLD === 4) {
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

    if (!cell.target.innerHTML && gameStage !== "Ended") {
      if (config.gameMode === "classic" && classicMode(row, col) || config.gameMode === "advanced") {
        cell.target.innerHTML = playerSymbols[currentPlayer];
        rows[row][col] = playerSymbols[currentPlayer];
        if(config.gameMode === "advanced"){
          advancedMode(row,col);
        }
      } else{
        console.log(
          `Impossoble to put ${currentPlayer} here - not a based field!`
        );
        return;
      }
      if (gameStage === "Paused") setGameStage("Running");
      if (isThereAWinner()) {
        setGameStage("Ended");
      } else {
        setCurrentPlayer(currentPlayer === config.firstPlayer ? config.secondPlayer : config.firstPlayer);
        setTime(config.timerValue);
      }
    }
    setRows(newRows);
  }
  function generateGrid() {
    return rows.map((row, rowIndex) =>
      row.map((cell, cellIndex) => (
        <div
          id={"row-" + rowIndex + "_col-" + cellIndex}
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

  useEffect(() => {
    let intervalId;
    if (!rows) {
      console.log("Entered");
      setRows(generateEmptyCellValues());
    }
    if (gameStage === "Running" && config.timerValue !== 0) {
      if (time === 0) {
        setCurrentPlayer(currentPlayer === config.firstPlayer ? config.secondPlayer : config.firstPlayer);
        setTime(config.timerValue);
      }
      intervalId = setInterval(() => {
        setTime(time - 1);
      }, 10);
    }

    if (gameStage === "Ended") {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [rows, gameStage, time]);

  function closeThePlayBoard() {
    alert("You have given up, bruuhh! The winner is " + currentPlayer);
    setAppState("MainMenu");
  }

  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  return (
    <div className="playboard-component">
      <div className="time-elapsed-stat">
        <h3>
          {config.timerValue !== 0 ? (`Time left: ${minutes.toString().padStart(2, "0")}:
          ${seconds.toString().padStart(2, "0")}:
          ${milliseconds.toString().padStart(2, "0")}`) : null}
        </h3>
      </div>
      <div className="close-button">
        <button onClick={closeThePlayBoard}>Give up</button>
      </div>
      <div>
        {gameStage === "Ended" ? (
          <h3>The winner - {playerSymbols[winner]}!</h3>
        ) : (
          <h3>Your turn: {currentPlayer}({playerSymbols[currentPlayer]})</h3>
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
