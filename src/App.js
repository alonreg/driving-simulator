import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import DriveConsole from "./components/driveConsole";
import Calculator from "./components/calculator";
import Score from "./components/score";
import TopConsole from "./components/topConsole";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as FirestoreService from "./firebase";
import Loader from "react-loader-spinner";
import Obstacle from "./obstacle";

function App() {
  const [score, setScore] = useState(0);
  const [obstaclesNum, setObstaclesNum] = useState(0);
  const [currentObstacle, setCurrentObstacle] = useState();
  const [userAutoMode, setUserMode] = useState(true); //starting point user mode - take from params
  const [autoMode, setMode] = useState(true);
  const [isMoving, setIsMoving] = useState(false); //Moving, or hit Obstacle
  const [sessionId, setSessionId] = useState();
  const [sessionData, setSessionData] = useState();
  const [parameters, setParameters] = useState();
  const [global, setGlobal] = useState();
  const [error, setError] = useState();

  //const [groceryListId, setGroceryListId] = useQueryString('listId');
  //TO USE QUERIES https://github.com/briandesousa/firebase-with-react-hooks/blob/logrocket-blog/src/App.js

  //Data to calculate passing chance

  // Use an effect to authenticate and load the grocery list from the database
  useEffect(() => {
    if (!parameters) {
      FirestoreService.getParametersData("set-1").then((params) => {
        setParameters(params.data());
        console.log("params: " + params.data()["computerError"]);
      });
      FirestoreService.getParametersData("global").then((params) => {
        setGlobal(params.data());
        //drive();
      });
    }
    FirestoreService.authenticateAnonymously()
      .then((userCredential) => {
        if (sessionId && sessionId == userCredential.user.id) {
        } else if (userCredential.user.uid) {
          setSessionId(userCredential.user.uid);
          FirestoreService.setSessionData(userCredential.user.uid);
        }
      })
      .catch(() => setError("anonymous-auth-failed"));
  }, []); //sessionId, setSessionId

  useEffect(() => {
    if (global) {
      drive();
    }
  }, [global]);

  //ssss
  function onSessionCreate(sessionId) {
    setSessionId(sessionId);
  }

  // ???
  function onCloseSession() {
    setSessionId();
    setSessionData();
  }

  const notifyGood = (message) =>
    toast.success(message, {
      style: { fontSize: 30 },
      position: "top-left",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
  const notifyBad = (message) =>
    toast.error(message, {
      position: "top-left",
      autoClose: 1000,
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

  const obstaclesAddition = () => {
    setObstaclesNum(obstaclesNum + 1);
    //console.log(obstaclesNum);
  };

  const userModeChange = (mode) => {
    setUserMode(mode);
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
    //return false;
    //console.log("decision = " + obstacle.desicion);
    //let obstacleData = { humanEstimate: 60, computerEstimate: 44 };
    //setCurrentObstacle(obstacleData);
  };

  const drive = () => {
    console.log("in drive");
    const timeout = Math.random() * 4000 + 1000;
    console.log(timeout);

    setIsMoving(true);
    //generateObstacleData();
    const obstacle = new Obstacle(
      global.k_value,
      global.random_values[0],
      global.random_values[1],
      parameters.humanError,
      parameters.computerError,
      {
        success: 100,
        pass_penalty: -10,
        fail: -90,
        rescue: -40,
      }
    );
    console.log("ccccc  " + obstacle.desicion);

    setTimeout(() => {
      console.log("set is moving - flase");
      setIsMoving(false);
    }, timeout); //Maximum drive time - 3 seconds
  };

  // if a session wasn't initialized yet
  if (!sessionId || !parameters || !global) {
    return (
      <div className="center-spinner">
        <Loader type="ThreeDots" color="#00BFFF" height={100} width={100} />
      </div>
    );
  }

  return (
    <div class="flex-container">
      <ToastContainer limit="2" style={{ fontSize: 30, textAlign: "center" }} />
      <div className="top-left">
        <p></p>
        <Score score={score} onChange={scoreAddition} />
      </div>
      <div className="top-right">
        <TopConsole
          userAutoMode={autoMode}
          autoMode={autoMode}
          onChange={modeChange}
          isMoving={isMoving}
          sessionId={sessionId}
          obstaclesNum={obstaclesNum}
        />
      </div>
      <div class="bottom-left">
        <br />
        <Calculator score={score} onChange={scoreAddition} />
      </div>
      <div class="bottom-right bordered">
        <DriveConsole
          isMoving={isMoving}
          autoMode={autoMode}
          score={score}
          onChange={{
            scoreAddition: scoreAddition,
            obstaclesAddition: obstaclesAddition,
          }}
          isMoving={isMoving}
          onArrowClick={drive}
          isFirstRun={obstaclesNum == 0}
          currentObstacle={
            currentObstacle ?? { humanEstimate: 1, computerEstimate: 3 }
          }
        />
      </div>
    </div>
  );
}

export default App;
