import React from 'react'
import '../../css/PlayBoard.css'


const GRID_HEIGHT = 6;
const GRID_WIDTH = 6;

function PlayBoard() {
    const [rows, setRows] = React.useState(generateEmptyCellValues()); // Find a more efficient way 
    // const [key, setKey] = React.useState(0);
    let isCirclePlaying = false;

    function generateEmptyCellValues() {
        const rows = [];
        for (let i = 0; i < GRID_HEIGHT * GRID_WIDTH; i++) {
            rows.push("");
        }
        return rows;
    }

    function resetHandler(e) {
        //Reset logic
        e.preventDefault();
    }
    function cellHandler(e) {
        const newRows = rows;
        const index = e.target.getAttribute("data-index");

        e.target.innerHTML = isCirclePlaying ? "O" : "X";
        isCirclePlaying = !isCirclePlaying;

        rows[index] = isCirclePlaying ? "O" : "X";
        console.log("Clicked " + index);
        setRows(newRows);
    }

    React.useEffect(() => {
        console.log("Happened")

    }, [rows]);

  return (
    <div className='playboard-component'>
        <div className='interface-wrapper'>
            <div className='board-field'>
                {rows.map((element, index) => {
                    return <div key={"cell-" + index} data-index={index} className='board-cell' onClick={cellHandler}>{element}</div>
                })}
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