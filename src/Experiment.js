import React, { useState, useEffect, useRef } from "react";
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
import Results from "./components/results";
import TermsDialog from "./components/termsDialog";
import Instructions from "./components/termsDialog";
import { BrowserRouter as Router, useParams } from "react-router-dom";

function Experiment() {
  let { id } = useParams();

  const [termsDialogOpen, setTermsDialogOpen] = useState(true);
  const [score, setScore] = useState(0);
  const [obstaclesNum, setObstaclesNum] = useState(0);
  const obstaclesNumRef = useRef(obstaclesNum);
  obstaclesNumRef.current = obstaclesNum;
  const [currentObstacle, setCurrentObstacle] = useState();
  const [userAutoMode, setUserMode] = useState(true); //starting point user mode - take from params
  const [autoMode, setMode] = useState(true);
  const [isMoving, setIsMoving] = useState(true); //Moving, or hit Obstacle
  const [sessionId, setSessionId] = useState();
  const [parameters, setParameters] = useState();
  const [global, setGlobal] = useState();
  const [error, setError] = useState();
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  ////////////////////////////////////////// SESSION DATA ////////
  const [sessionData, setSessionData] = useState({
    session: sessionId,
    successByHuman: 0,
    successByComp: 0,
    failByHuman: 0,
    failByComp: 0,
    startTime: Date.now(), //delta
    totalTimeInSeconds: 0,
    modeChanges: 0,
    parameters: "",
  });

  // Use an effect to authenticate and load the grocery list from the database
  useEffect(() => {
    if (!parameters) {
      FirestoreService.getParametersData(id).then((params) => {
        const data = params.data();
        setParameters(data);
        setMode(data.startWithAuto);
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
    if (global && started && !ended) {
      drive();
    }
  }, [global, started]);

  useEffect(() => {
    if (parameters && parameters.obstaclesNum == obstaclesNumRef.current) {
      setTimeout(() => {
        end();
      }, 1000);
      return;
    } else {
      console.log(
        "obstacleNum: " + obstaclesNum + "  " + obstaclesNumRef.current
      );
    }
  }, [obstaclesNum]);

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
    setScore((score) => v + score);
  };

  const obstaclesAddition = () => {
    setObstaclesNum(obstaclesNum + 1);
    //console.log(obstaclesNum);
  };

  const userModeChange = (mode) => {
    setUserMode(mode);
  };

  const modeChange = (mode) => {
    setSessionData({
      ...sessionData,
      modeChanges: sessionData["modeChanges"] + 1,
    });
    setMode(mode);
  };

  const start = () => {
    setStarted(true);
  };

  const end = () => {
    FirestoreService.setSessionData({
      ...sessionData,
      session: sessionId,
      score: score,
      scoreBoard: parameters.scoreBoard,
      parameters: "enter-set-dynamically",
    });
    setEnded(true);
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
    const timeout = Math.random() * 2000 + 1500;
    console.log(timeout);

    setIsMoving(true);
    //generateObstacleData();
    const obstacle = new Obstacle(
      global.k_value,
      global.random_values[0],
      global.random_values[1],
      parameters.humanError,
      parameters.computerError,
      parameters.success,
      parameters.fail,
      parameters.pass,
      parameters.rescue
    );
    setCurrentObstacle(obstacle);
    const driveTimeout = setTimeout(() => {
      console.log("set is moving - flase");
      setIsMoving(false);
    }, timeout);
    return () => clearTimeout(driveTimeout);
  };

  const onTermsDialogClose = function () {
    window.open("about:blank", "_self");
    window.close();
  };

  // if a session wasn't initialized yet
  if (!sessionId || !parameters || !global) {
    return (
      <>
        <div className="center-spinner">
          <Loader type="ThreeDots" color="#00BFFF" height={100} width={100} />
        </div>
      </>
    );
  }

  return ended ? (
    <Results score={score} obstacles={obstaclesNum} />
  ) : (
    <>
      <TermsDialog
        open={termsDialogOpen}
        onAgree={() => setTermsDialogOpen(false)}
        onDecline={onTermsDialogClose}
      />
      <Instructions
        open={false}
        onAgree={() => setTermsDialogOpen(false)}
        onDecline={onTermsDialogClose}
      />

      <div class="flex-container">
        <ToastContainer
          limit="2"
          style={{ fontSize: 30, textAlign: "center" }}
        />
        <div className="top-left">
          <p></p>
          <Score
            score={score}
            scoreBoard={{
              calculation: parameters.calculation,
              pass: parameters.pass,
              fail: parameters.fail,
              rescue: parameters.rescue,
              success: parameters.success,
            }}
            onChange={scoreAddition}
          />
        </div>
        <div className="top-right">
          <TopConsole
            userAutoMode={autoMode}
            autoMode={autoMode}
            onChange={modeChange}
            isMoving={isMoving}
            sessionId={sessionId}
            obstaclesNum={obstaclesNum}
            started={started}
          />
        </div>
        <div class="bottom-left">
          <br />
          <Calculator
            score={score}
            onChange={scoreAddition}
            started={started}
            scoreBoard={{
              calculation: parameters.calculation,
              pass: parameters.pass,
              fail: parameters.fail,
              rescue: parameters.rescue,
              success: parameters.success,
            }}
          />
        </div>
        <div class="bottom-right bordered">
          <DriveConsole
            isMoving={isMoving}
            autoMode={autoMode}
            score={score}
            scoreBoard={{
              calculation: parameters.calculation,
              pass: parameters.pass,
              fail: parameters.fail,
              rescue: parameters.rescue,
              success: parameters.success,
            }}
            onChange={{
              scoreAddition: scoreAddition,
              obstaclesAddition: obstaclesAddition,
            }}
            isMoving={isMoving}
            onArrowClick={drive}
            isFirstRun={obstaclesNum == 0}
            currentObstacle={currentObstacle}
            started={started}
            startOnClick={start}
            obstacles={obstaclesNum}
          />
        </div>
      </div>
    </>
  );
}

export default Experiment;
