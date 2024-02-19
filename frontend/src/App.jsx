import { useEffect, useState } from "react";

import PlayBoard from "./components/PlayBoard/PlayBoard";
import SetUp from "./components/StartScreen/Setup";
import StartScreen from "./components/StartScreen/StartScreen";
import "./css/App.css";

function App() {
  const [hasGameStarted, setGameStarted] = useState(false);
  const [gameSetup, setGameSetup] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    const chachedIfStarted = localStorage.getItem("hasGameStarted");
    const chachedOfflineMode = localStorage.getItem("offlineMode");
    const chachedGameSetup = localStorage.getItem("gameSetup");
    if (chachedGameSetup) {
      setGameSetup(JSON.parse(chachedGameSetup));
    }
    if (chachedIfStarted) {
      setGameStarted(JSON.parse(chachedIfStarted));
    }
    if (chachedOfflineMode) {
      setOfflineMode(JSON.parse(chachedOfflineMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("hasGameStarted", hasGameStarted);
  }, [hasGameStarted]);
  useEffect(() => {
    localStorage.setItem("offlineMode", offlineMode);
  }, [offlineMode]);
  useEffect(() => {
    localStorage.setItem("gameSetup", gameSetup);
  }, [gameSetup]);

  if(gameSetup)
    return (
      <div className="App">
        <SetUp setGameStarted={setGameStarted} setGameSetup={setGameSetup}/>
      </div>
    );
  else if(hasGameStarted)
    return (
      <div className="App">
        <PlayBoard hasGameStarted={hasGameStarted} setGameStarted={setGameStarted} isOfflineMode={offlineMode}/>
      </div>
    );
  else
    return (
      <div className="App">
        <StartScreen setGameSetup={setGameSetup} setOfflineMode={setOfflineMode}/>
      </div>
    );
}

export default App;
