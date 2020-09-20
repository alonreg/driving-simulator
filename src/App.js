import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import DriveConsole from "./components/driveConsole";
import Calculator from "./components/calculator";
import Score from "./components/score";
import TopConsole from "./components/topConsole";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [score, setScore] = useState(0);
  const [autoMode, setMode] = useState(false);
  const [isMoving, setIsMoving] = useState(false); //Moving, or hit Obstacle
  const [chances, setChances] = useState({
    humanChance: 50,
    computerChance: 40,
    humanError: 30,
    computerError: 40,
  }); //Data to calculate passing chance

  const notifyGood = (message) =>
    toast.success(message, {
      style: { fontSize: 30 },
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
  const notifyBad = (message) =>
    toast.error(message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });

  const scoreAddition = (v) => {
    if (v > 0) {
      const message = "+" + v;
      notifyGood(message);
    } else if (v < 0) {
      const message = v;
      notifyBad(message);
    }
    setScore(v + score);
  };

  const modeChange = (mode) => {
    setMode(mode);
  };

  /*
  const carStatusChange = (isMoving) => {
    setIsMoving(isMoving);
  };
*/

  //Renders data regarding the chance of the car to pass the obstacle succesfuly
  const generateObstacleData = () => {
    const obstacleData = { humanChance: 0, computerChance: 0 };
    if (autoMode) {
      //AutoMode is on:
      obstacleData["humanChance"] = -1;
      obstacleData["computerChance"] =
        chances["computerChance"] - chances["computerError"]; // Mock temp calculation
    } else {
      //AutoMode is off:
      obstacleData["computerChance"] =
        chances["computerChance"] - chances["computerError"]; // Mock temp calculation
      obstacleData["humanChance"] =
        chances["humanChance"] - chances["humanChance"]; // Mock temp calculation
    }
    return obstacleData;
  };

  const drive = () => {
    setIsMoving(true);
    if (isMoving) {
      console.log("");
    }
    setTimeout(() => setIsMoving(false), Math.random() * 3000); //Maximum drive time - 3 seconds

    console.log(isMoving);
  };

  return (
    <div class="flex-container">
      <ToastContainer limit="2" style={{ fontSize: 30, textAlign: "center" }} />
      <div class="top-left">
        <p></p>
        <Score score={score} onChange={scoreAddition} />
      </div>
      <div class="top-right">
        <TopConsole
          autoMode={autoMode}
          onChange={modeChange}
          isMoving={isMoving}
        />
      </div>
      <div class="bottom-left">
        <br />
        <Calculator score={score} onChange={scoreAddition} />
      </div>
      <div class="bottom-right">
        <DriveConsole
          autoMode={autoMode}
          score={score}
          onChange={scoreAddition}
          isMoving={isMoving}
          onArrowClick={drive}
        />
      </div>
    </div>
  );
}

export default App;
