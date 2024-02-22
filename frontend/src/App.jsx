import { useEffect, useState } from "react";

import PlayBoard from "./components/PlayBoard/PlayBoard";
import SetUp from "./components/StartScreen/Setup";
import StartScreen from "./components/StartScreen/StartScreen";
import "./css/App.css";

function App() {
  const [config, setConfig] = useState(null);
  const [currentState, setCurrentState] = useState("MainMenu");       //For now, there are 3 states                  
  useEffect(() => {                                                   //for currentState : 
    const cachedCurrentState = localStorage.getItem("currentState");  //1. MainMenu     
    const cachedConfig = localStorage.getItem("config");              //2. SetUp
    if (cachedCurrentState) {                                         //3. Game
      setCurrentState(cachedCurrentState);
    }
    console.log(currentState)
    if(cachedConfig){
      setConfig(cachedConfig);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentState", currentState);
  }, [currentState]);
  useEffect(() => {
    localStorage.setItem("config", config);
  },[config]);
  switch(currentState){
    case "SetUp":
      return (
        <div className="App">
          <SetUp setAppState={setCurrentState} setConfig={setConfig}/>
        </div>
      );
    case "Game":
      return (
        <div className="App">
          <PlayBoard setAppState={setCurrentState} config={config}/>
        </div>
      );
    case "MainMenu":
      return (
        <div className="App">
          <StartScreen setAppState={setCurrentState}/>
        </div>
      );
  }
}

export default App;
