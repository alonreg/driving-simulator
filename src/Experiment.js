import React, { useState, useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import DriveConsole from "./components/driveConsole";
import Calculator from "./components/calculator";
import TopConsole from "./components/topConsole";
import "react-toastify/dist/ReactToastify.css";
import * as FirestoreService from "./firebase";
import Loader from "react-loader-spinner";
import Obstacle from "./obstacle";
import Results from "./components/results";

/////
import Toast from "react-bootstrap/Toast";

import {
  BrowserRouter as Router,
  useParams,
  useLocation,
} from "react-router-dom";

const NotificationToast = ({ text, show, setShow }) => {
  return (
    <>
      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
          <strong className="mr-auto">Bootstrap</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>{text}</Toast.Body>
      </Toast>
      <button onClick={() => setShow(true)}>Show Toast</button>
    </>
  );
};

function Experiment(props) {
  const location = useLocation();
  let { id, urlInfoDataId } = useParams();
  const [show, setShow] = useState(false);
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
  const [successByHuman, setSuccessByHuman] = useState(0);
  const [successByComp, setSuccessByComp] = useState(0);
  const [failByHuman, setSailByHuman] = useState(0);
  const [failByComp, setFailByComp] = useState(0);
  const [rescueCount, setRescueCount] = useState(0);
  const [calcSuccess, setCalcSuccessCount] = useState(0);
  const [calcFail, setCalcFailCount] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [modeChanges, setModeChanges] = useState(0);
  const [log, setLog] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const addSuccessFailToSessionData = (addTo) => {
    console.log(addTo + "   in add to ");
    switch (addTo) {
      case "successByHuman":
        setSuccessByHuman(successByHuman + 1);
        break;
      case "successByComp":
        setSuccessByComp(successByComp + 1);
        break;
      case "failByHuman":
        setSailByHuman(failByHuman + 1);
        break;
      case "failByComp":
        setFailByComp(failByComp + 1);
        break;
      case "rescue":
        setRescueCount(rescueCount + 1);
        break;
      case "calcSuccess":
        setCalcSuccessCount(calcSuccess + 1);
        break;
      case "calcFail":
        setCalcFailCount(calcFail + 1);
        break;
    }
  };

  /**
    const [sessionData, setSessionData] = useState({
    session: sessionId,
    successByHuman: 0,
    successByComp: 0,
    failByHuman: 0,
    failByComp: 0,
    startTime: Date.now(), //delta
    modeChanges: 0,
  });
   */

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
  }, []); //sessionId, setSessionId

  useEffect(() => {
    // create the new session in firestore
    if (parameters && global) {
      FirestoreService.authenticateAnonymously()
        .then((userCredential) => {
          if (sessionId && sessionId == userCredential.user.id) {
          } else if (userCredential.user.uid) {
            setSessionId(userCredential.user.uid);
            FirestoreService.createSession({
              session: userCredential.user.uid,
              pollData: location.pollData,
              startTime: startTime,
              parameters: parameters,
              global: global,
              parametersSet: id,
            });
            addToLog("started", "none");
          }
        })
        .catch(() => {
          addToLog("error", "anonymous-auth-failed");
          setError("anonymous-auth-failed");
        });
    }
  }, [parameters, global]);

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

  const notifyGood = (message) => 1;
  /*toast.success(message, {
      style: { fontSize: 30 },
      position: "top-left",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });*/

  const notifyBad = (message) => 1;

  /*
    toast.error(message, {
      position: "top-left",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    }*/

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
    mode ? addToLog("switch-auto", "human") : addToLog("switch-man", "human");
    setModeChanges(modeChanges + 1);
    setMode(mode);
  };

  const start = () => {
    addToLog("pressed-start", "human");
    setStarted(true);
  };

  const end = async () => {
    FirestoreService.setSessionData({
      session: sessionId,
      score: score,
      successByHuman: successByHuman,
      successByComp: successByComp,
      failByHuman: failByHuman,
      failByComp: failByComp,
      rescueCount: rescueCount,
      calcSuccess: calcSuccess,
      calcFail: calcFail,
      startTime: startTime,
      endTime: Date.now(),
      modeChanges: modeChanges,
      log: [
        ...log,
        {
          timestamp: Date.now(),
          action: "end",
          host: "none",
          currentScore: score ?? "empty",
          currentObstacle_computerDecision:
            currentObstacle?.decision ?? "empty",
          currentObstacle_ev_f: currentObstacle?.ev_f ?? "empty",
          currentObstacle_ev_r: currentObstacle?.ev_r ?? "empty",
          currentObstacle_ev_l: currentObstacle?.ev_l ?? "empty",
          currentObstacle_ev_rescue: currentObstacle?.ev_rescue ?? "empty",
          currentObstacle_computer_f:
            currentObstacle?.obstacleValueWithError_computer_f ?? "empty",
          currentObstacle_computer_r:
            currentObstacle?.obstacleValueWithError_computer_r ?? "empty",
          currentObstacle_computer_l:
            currentObstacle?.obstacleValueWithError_computer_l ?? "empty",
          currentObstacle_human_f:
            currentObstacle?.obstacleValueWithError_human_f ?? "empty",
          currentObstacle_human_r:
            currentObstacle?.obstacleValueWithError_human_r ?? "empty",
          currentObstacle_human_l:
            currentObstacle?.obstacleValueWithError_human_l ?? "empty",
          currentObstacle_real_f: currentObstacle?.real_f ?? "empty",
          currentObstacle_real_r: currentObstacle?.real_r ?? "empty",
          currentObstacle_real_l: currentObstacle?.real_l ?? "empty",
          autonomousMode: autoMode ?? "empty",
          successByHuman: successByHuman ?? "empty",
          successByComp: successByComp ?? "empty",
          failByHuman: failByHuman ?? "empty",
          failByComp: failByComp ?? "empty",
          rescueCount: rescueCount ?? "empty",
          calcSuccess: calcSuccess ?? "empty",
          calcFail: calcFail ?? "empty",
          modeChanges: modeChanges ?? "empty",
        },
      ],
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

  const addToLog = (action, host) => {
    const newLog = {
      timestamp: Date.now(),
      action: action ?? "empty",
      host: host ?? "empty",
      currentScore: score ?? "empty",
      currentObstacle_computerDecision: currentObstacle?.decision ?? "empty",
      currentObstacle_ev_f: currentObstacle?.ev_f ?? "empty",
      currentObstacle_ev_r: currentObstacle?.ev_r ?? "empty",
      currentObstacle_ev_l: currentObstacle?.ev_l ?? "empty",
      currentObstacle_ev_rescue: currentObstacle?.ev_rescue ?? "empty",
      currentObstacle_computer_f:
        currentObstacle?.obstacleValueWithError_computer_f ?? "empty",
      currentObstacle_computer_r:
        currentObstacle?.obstacleValueWithError_computer_r ?? "empty",
      currentObstacle_computer_l:
        currentObstacle?.obstacleValueWithError_computer_l ?? "empty",
      currentObstacle_human_f:
        currentObstacle?.obstacleValueWithError_human_f ?? "empty",
      currentObstacle_human_r:
        currentObstacle?.obstacleValueWithError_human_r ?? "empty",
      currentObstacle_human_l:
        currentObstacle?.obstacleValueWithError_human_l ?? "empty",
      currentObstacle_real_f: currentObstacle?.real_f ?? "empty",
      currentObstacle_real_r: currentObstacle?.real_r ?? "empty",
      currentObstacle_real_l: currentObstacle?.real_l ?? "empty",
      autonomousMode: autoMode ?? "empty",
      successByHuman: successByHuman ?? "empty",
      successByComp: successByComp ?? "empty",
      failByHuman: failByHuman ?? "empty",
      failByComp: failByComp ?? "empty",
      rescueCount: rescueCount ?? "empty",
      calcSuccess: calcSuccess ?? "empty",
      calcFail: calcFail ?? "empty",
      modeChanges: modeChanges ?? "empty",
    };
    setLog([...log, newLog]);
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
      <div class="parent-experiment">
        {/*<ToastContainer
          limit="2"
         style={{ fontSize: 30, textAlign: "center" }}
        >*/}
        <NotificationToast
          text="hi"
          show={showToast}
          setShowToast={(show) => setShowToast(show)}
        />
        {/*<div className="top-left">
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
        </div>*/}
        <div className="div1-experiment">
          <TopConsole
            userAutoMode={autoMode}
            autoMode={autoMode}
            onChange={modeChange}
            isMoving={isMoving}
            obstaclesNum={obstaclesNum}
            started={started}
            score={score}
          />
        </div>

        <div className="div2-experiment">
          <Calculator
            score={score}
            onChange={scoreAddition}
            started={started}
            addToLog={addToLog}
            addSuccessFailToSessionData={addSuccessFailToSessionData}
            scoreBoard={{
              calculation: parameters.calculation,
              pass: parameters.pass,
              fail: parameters.fail,
              rescue: parameters.rescue,
              success: parameters.success,
            }}
          />
        </div>
        <div className="div3-experiment">
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
              addSuccessFailToSessionData: addSuccessFailToSessionData,
              addToLog: addToLog,
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
      <p>sessionid for debug: {sessionId}</p>
    </>
  );
}

export default Experiment;
