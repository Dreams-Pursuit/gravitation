// import React from "react";
import "../../css/StartScreen.css";

function StartScreen({ setGameSetup, setOfflineMode }) {

  function onSetup(e) {
    e.preventDefault();
    if (e.target.id === "offline-mode-btn") setOfflineMode(true);
    setGameSetup(true);
  }

  return (
    <div className="start-screen">
      <h1>Gravitation</h1>
      <p><i>Empower yourself by an extase from each move</i></p>
      <br />
      <br />
      <button id="offline-mode-btn" className="choose-mode-btn" onClick={onSetup}>Offline Mode</button>
      <button className="choose-mode-btn" onClick={onSetup}>Multiplayer</button>
    </div>
  );
}

export default StartScreen;
