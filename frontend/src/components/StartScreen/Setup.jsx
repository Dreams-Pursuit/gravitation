import "../../css/Setup.css"

function SetUp({setGameStarted, setGameSetup}){
    function onStartOfflineModeButton(e) {
        e.preventDefault();
        const gameMode = document.querySelector("input[name=\"mode\"]:checked").id;
        const firstPlayer = document.getElementById("player1Name").value;
        const secondPlayer = document.getElementById("player2Name").value;
        if (e.target.id === "game-start-button")setGameStarted(true);
        setGameSetup(false);
    }
    function goBackToMenu(e){
        e.preventDefault();
        if(e.target.id === "back-to-menu-button")setGameSetup(false);
    }

    function onTimerCheck(e){
        var timerCheckbox = document.getElementById("timer");
        var timerFields = document.getElementById("timer-value");
        console.log("Timer checked");
        timerFields.hidden = !timerCheckbox.checked;
    }
    function validateTimerInput(e){
        if(e.target.value === ''){
            console.log(e);
            e.target.value = e.target.defaultValue;
        }else if(Number.parseInt(e.target.value) < 0){
            e.target.value = "00";
        }else if(e.target.id == "timer-minute" && Number.parseInt(e.target.value) > 10){
            e.target.value = "10";
        }else if(e.target.id == "timer-second" && Number.parseInt(e.target.value) > 59){
            e.target.value = "59";
        }
    }

    return(
        <div className="setup-component">
            <button id="back-to-menu-button" onClick={goBackToMenu}>Back</button>
            <div className="setup-menu">
                <h1>
                    Settings
                </h1>
                <form className="choose-mode">
                    <div className="mode-option">
                        <input type="radio" id="classic" name="mode" checked />
                        <label for="classic">Classic Mode</label><br/>
                    </div>
                    <div className="mode-option">
                        <input type="radio" id="advanced"  name="mode" />
                        <label for="advanced">Advanced mode</label><br/>
                    </div>
                </form>
                <input type="text" id="player1Name" defaultValue="Player 1" maxLength="25" required /><br/>
                <input type="text" id="player2Name"  defaultValue="Player 2" maxLength="25" required /><br/>
                <div id="timer-checkbox">
                    <input type="checkbox" id="timer" onClick={onTimerCheck}/>
                    <label for="timer">Timer</label>
                </div>
                <div id="timer-value" hidden>
                    <input type="text" id="timer-minute" defaultValue="00" size="2" onBlur={validateTimerInput}/>
                    <label>:</label>
                    <input type="text" id="timer-second" defaultValue="30" size="2" onBlur={validateTimerInput} required/>
                </div>
                <button id="game-start-button" onClick={onStartOfflineModeButton}>Start game</button>
            </div>
        </div>
    );
}

export default SetUp;