

function SetUp({setGameStarted, setGameSetup}){
    function onStartOfflineModeButton(e) {
        e.preventDefault();
        const gameMode = document.querySelector("input[name=\"mode\"]:checked").id;
        const firstPlayer = document.getElementById("player1Name").value;
        const secondPlayer = document.getElementById("player2Name").value;
        if (e.target.id === "game-start-button")setGameStarted(true);
        setGameSetup(false);
    }

    function onTimerCheck(e){
        var timerCheckbox = document.getElementById("timer-check");
        var timerFields = document.getElementById("timer-value");
        console.log("Timer checked");
        timerFields.hidden = !timerCheckbox.checked;
    }

    return(
        <div className="setup-screen">
            <h1>
                Settings
            </h1>
            <form>
                <input type="radio" id="classic" name="mode" checked />
                <label for="classic">Classic Mode</label><br/>
                <input type="radio" id="advanced" name="mode" />
                <label for="advanced">Advanced mode</label><br/>
            </form>
            <input type="text" id="player1Name" defaultValue="Player 1" pattern="[a-zA-Z0-9\s]+" required /><br/>
            <input type="text" id="player2Name" defaultValue="Player 2" pattern="[a-zA-Z0-9\s]+" required /><br/>
            <input type="checkbox" id="timer-check" onClick={onTimerCheck}/>
            <label for="timer">Timer</label>
            <div id="timer-value" hidden>
                <input type="text" id="timer-minutes" defaultValue="00" pattern="[0-9]+"/>
                <input type="text" id="timer-seconds" defaultValue="30" min="0" max="59" pattern="[0-9]+" required/>
            </div>
            <button id="game-start-button" onClick={onStartOfflineModeButton}>Start game</button>
        </div>
    );
}

export default SetUp;