import React from 'react'
import '../../css/PlayBoard.css'


const GRID_HEIGHT = 6;
const GRID_WIDTH = 6;

function PlayBoard() {
    const [rows, setRows] = React.useState(generateEmptyCellValues()); // Find a more efficient way 
    const [currentPlayer, setCurrentPlayer] = React.useState("X");
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
        document.querySelectorAll(".board-cell").forEach((cell) => {
            cell.innerHTML = "";
        });
    }

    function isValidIndex(index) {
        if (index < GRID_WIDTH) return true;

        return rows[index - GRID_WIDTH] ? true : false;
    }

    function cellHandler(e) {
        const newRows = rows;
        const index = e.target.getAttribute("data-index");

        if (!e.target.innerHTML && isValidIndex(index)) {   
            e.target.innerHTML = isCirclePlaying ? "O" : "X";
            rows[index] = e.target.innerHTML;

            isCirclePlaying = !isCirclePlaying;
        }
        // setCurrentPlayer(isCirclePlaying ? "O" : "X"); //Causes the bug
        console.log("Clicked: " + index);
        setRows(newRows);
        console.log(rows);
    }

    function generateGrid() {
        return rows.map((element, index, array) => {
            return <div key={"cell-" + (array.length - index - 1)} data-index={array.length - index - 1} className='board-cell' onClick={cellHandler}>{element}</div>
        });
    }

    React.useEffect(() => {
        console.log("Happened")

    }, [rows]);

  return (
    <div className='playboard-component'>
        <div className='time-elapsed-stat'>
            <h3>Time elapsed: 00:00:00</h3>
        </div>
        <div>
            <h3>Your turn: {currentPlayer}</h3>
        </div>
        <div className='interface-wrapper'>
            <div className='board-field'>
                {generateGrid()}
            </div>
            <div className='board-control'>
                <div className='buttons-wrapper'>
                    <button onClick={resetHandler}>Reset</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PlayBoard;