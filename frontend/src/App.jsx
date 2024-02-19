import { useEffect, useState } from "react";

import PlayBoard from "./components/PlayBoard/PlayBoard";
import StartScreen from "./components/StartScreen/StartScreen";
import "./css/App.css";

function App() {
  const [hasGameStarted, setGameStarted] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    const chachedIfStarted = localStorage.getItem("hasGameStarted");
    const chachedOfflineMode = localStorage.getItem("offlineMode");
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

  return (
    <div className="App">
      { hasGameStarted ? <PlayBoard setGameStarted={setGameStarted} isOfflineMode={offlineMode}/> : <StartScreen setGameStarted={setGameStarted} setOfflineMode={setOfflineMode}/> }
    </div>
  );
}

export default App;
