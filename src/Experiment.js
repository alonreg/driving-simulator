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
import {
  BrowserRouter as Router,
  useParams,
  useLocation,
  useHistory,
} from "react-router-dom";

/** Experiment Page:
 * (Example [test]: https://driving-simulator-tau-test.web.app/set-1/info-1/2)
 * Handles display and logic for the experiment.
 * Holds experiment's state
 */
function Experiment(props) {
  const location = useLocation(); // passing metadata from the pre-experiment part
  let { id } = useParams(); // extract experiment-id from URL, to choose experiment config
  let history = useHistory();
  const queryString = require("query-string");
  const parsed = queryString.parse(window.location.search);

  // experiment state:
  const [score, setScore] = useState(0); // user score
  const [obstaclesNum, setObstaclesNum] = useState(0); // obstacles passed by user
  const obstaclesNumRef = useRef(obstaclesNum); // reference to obstacleNum state
  obstaclesNumRef.current = obstaclesNum; // assign the obstacleNum state to the reference
  const [currentObstacle, setCurrentObstacle] = useState(); // holds the current obstacle object
  const [autoMode, setMode] = useState(true); // boolean - is Auto Mode currently on?
  const [isMoving, setIsMoving] = useState(true); //Moving, or hit Obstacle
  const [sessionId, setSessionId] = useState(); // session id is the user identification
  const [parameters, setParameters] = useState(); // parameters set used in the experiment
  const [error, setError] = useState(); // error state, currently not being used
  const [started, setStarted] = useState(false); // boolean flag - true after experiment starts
  const [ended, setEnded] = useState(false); // boolean flag - true after experiment ends
  // SESSION DATA ////////
  const [successByHuman, setSuccessByHuman] = useState(0); // counts no. of successes when manual
  const [successByComp, setSuccessByComp] = useState(0); //  counts no. of successes when Auto mode
  const [failByHuman, setSailByHuman] = useState(0); // counts no. of failures when Auto mode
  const [failByComp, setFailByComp] = useState(0); // counts no. of failures when Auto Mode
  const [rescueCount, setRescueCount] = useState(0); // counts no. of rescue calls
  const [calcSuccess, setCalcSuccessCount] = useState(0); // counts no. of calculation successes
  const [calcFail, setCalcFailCount] = useState(0); // counts no. of calculation failures
  const [startTime, setStartTime] = useState(Date.now()); // UTC start time
  const [modeChanges, setModeChanges] = useState(0); // counts no. of mode (Auto / Manual) changes
  const [log, setLog] = useState([]); // holds the log with info about current session
  const logRef = useRef(log); // reference to log state
  logRef.current = log; // assign the log state to the reference

  /** adds +1 to the success / failure count
   * gets one of the following strings:
   * "successByHuman","successByComp","failByComp","rescue","calcSuccess", "calcFail"
   *  */
  const addSuccessFailToSessionData = (addTo) => {
    //console.log("   in add to session data " + addTo);
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

  // Use an effect to get parameters data from firebase according to parameters set name (=id)
  useEffect(() => {
    if (!parameters) {
      FirestoreService.getParametersData(id).then((params) => {
        const data = params.data();
        setParameters(data);
        setMode(data.startWithAuto);
      });
    }
  }, []);

  /**
   * Use an effect to authenticate anonymously, using firebase.
   * This is used to maintain an identity for each experiment user.
   * You can view current saved users at the firebase console.
   * Than, create a new session with that user's id
   *  */
  useEffect(() => {
    if (parameters) {
      FirestoreService.authenticateAnonymously()
        .then((userCredential) => {
          if (sessionId && sessionId == userCredential.user.id) {
          } else if (userCredential.user.uid) {
            setSessionId(userCredential.user.uid);
            FirestoreService.createSession({
              aid: location.aid ? location.aid : parsed.aid,
              session: userCredential.user.uid,
              questions: location.questions
                ? location.questions
                : localStorage.getItem("questions") // check if it is available
                ? JSON.parse(localStorage.getItem("questions"))
                : ["no-data"], // user answers to questionare in the pre-experiment stage
              // if the answers are empty, get the answers from the local storage if there are any
              answers: location.answers
                ? location.answers
                : localStorage.getItem("questionsState") // check if it is available
                ? JSON.parse(localStorage.getItem("questionsState"))
                : ["no-data"], // user answers to questionare in the pre-experiment stage
              startTime: startTime,
              parameters: parameters,
              parametersSet: id,
            });
            addToLog("started", "none"); // add to log - the session has started
            // if user has almost finished, than redirect it to researchGate
            if (
              localStorage.getItem("isAlmostFinished") == true ||
              localStorage.getItem("isAlmostFinished") == "true"
            ) {
              endPrematurely(userCredential.user.uid);
            }
          }
        })
        .catch(() => {
          addToLog("error", "anonymous-auth-failed"); // add error to the log
          setError("anonymous-auth-failed"); // set the error state with the current error
        });
    }
  }, [parameters]);

  // use effect to start the driving, when the user presses start
  // makes sure parameters were downloaded
  // and that the experiment hasn't ended
  useEffect(() => {
    if (parameters && started && !ended) {
      drive();
    }
  }, [parameters, started]);

  // use effect to end the session when max number of obstacles achieved
  useEffect(() => {
    if (parameters && parameters.obstaclesNum == obstaclesNumRef.current) {
      setTimeout(() => {
        end();
      }, 1000);
      return;
    } else if (
      parameters &&
      obstaclesNumRef.current >= parameters.obstaclesNum * 0.8
    ) {
      // checks if user has completed 80% of the game, if it does - redirect it to reserachgate
      localStorage.setItem("isAlmostFinished", true);
      localStorage.setItem("logBackup", JSON.stringify(log));
      localStorage.setItem("startTime", startTime);
    }
  }, [obstaclesNum]);

  //const notifyGood = (message) => 1; // currently not used
  //const notifyBad = (message) => 1; // currently not used
  //const scoreAddition = (v) => {
  // currently not used
  //if (v > 0) {
  //  const message = "+" + v;
  //  notifyGood(message);
  //} else if (v < 0) {
  //  const message = v;
  // notifyBad(message);
  //}
  // setScore((score) => v + score);
  //};

  const endPrematurely = (currentSessionId) => {
    const restoredLog = localStorage.getItem("logBackup")
      ? JSON.parse(localStorage.getItem("logBackup"))
      : {};
    FirestoreService.setSessionData({
      session: currentSessionId,
      score: -1,
      successByHuman: successByHuman,
      successByComp: successByComp,
      failByHuman: failByHuman,
      failByComp: failByComp,
      rescueCount: rescueCount,
      calcSuccess: calcSuccess,
      calcFail: calcFail,
      startTime: localStorage.getItem("startTime")
        ? localStorage.getItem("startTime")
        : startTime,
      endTime: Date.now(),
      modeChanges: modeChanges,
      log: [
        ...restoredLog,
        {
          timestamp: Date.now(),
          action: "end-prematurely",
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

    console.log(
      "ended prematurely, with " +
        obstaclesNum +
        " out of " +
        parameters.obstaclesNum +
        ", ended is set to: " +
        ended.toString()
    );
    localStorage.setItem("isAlmostFinished", false);
    localStorage.removeItem("logBackup");
    localStorage.removeItem("startTime");
    setEnded(true);

    console.log(
      "ended prematurely, with " +
        obstaclesNum +
        " out of " +
        parameters.obstaclesNum +
        ", ended is set to: " +
        ended.toString()
    );
  };

  // adds score addition to the score state
  const scoreAddition = (addition) => {
    setScore((score) => addition + score);
  };

  // adds obstacle to the obstacle count state
  const obstaclesAddition = () => {
    setObstaclesNum(obstaclesNum + 1);
  };

  // adds a mode-change to the mode-change counter
  // adds mode-change to the log, log is dependant on the current mode
  const modeChange = (mode) => {
    mode ? addToLog("switch-auto", "human") : addToLog("switch-man", "human");
    setModeChanges(modeChanges + 1);
    setMode(mode);
  };

  // when the user presses the start button
  const start = () => {
    addToLog("pressed-start", "human");
    setStarted(true);
  };

  // when the session ends, upload data to firestore
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

  const drive = () => {
    // baseTimeout represents the core timeout parameteres to decide how long to wait between obstacles
    // this calculation achieves a random timeout between 2 obstacles, while maintaining a min-max timeout
    // the min-max timeout can be changed in the firestore parameters
    const baseTimeout =
      parameters.timeoutNextObstacleMax - parameters.timeoutNextObstacleFloor;
    const timeout =
      Math.random() * baseTimeout + parameters.timeoutNextObstacleFloor;

    // moving state changed to true - the car is moving
    setIsMoving(true);
    // creates a new obstacle object, using firestore parameters
    const obstacle = new Obstacle(
      // notice: parameters can be changed at  https://driving-simulator-tau.web.app/settings
      // for test, use: https://driving-simulator-tau-test.web.app/settings
      parameters.kValue, // k-value
      parameters.randomValues[0], // first random value
      parameters.randomValues[1], // second random value
      parameters.humanError, // the human error e-h
      parameters.computerError, // the computer error e-c
      parameters.success, // points for succesful pass
      parameters.fail, // penalty points for failting to pass
      parameters.pass, // penalty points for passing
      parameters.rescue // penalty points for calling a rescue
    );
    setCurrentObstacle(obstacle); // hold the current obstacle in the state
    const driveTimeout = setTimeout(() => {
      // use the timeout we calculated to delay the next obstacle
      setIsMoving(false);
      addToLog("new-obstacle", "none");
    }, timeout);
    return () => clearTimeout(driveTimeout);
  };

  // logging mechanism, whenever the vehicle stops, a new obstacle appears and is logged
  /*   useEffect(() => {
    if (!isMoving) {
      addToLog("new-obstacle", "none");
    }
  }, [isMoving]); */

  //const helperFunctionAddToLog = () => addToLog("new-obstacle", "none");

  // a function to add actions to the log.
  // the function creates a new log object each time
  // and then replaces the old log with the new one
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

    setLog([...logRef.current, newLog]);
  };

  // if a session wasn't initialized yet, show a 3-dot loader animation
  if (!sessionId || !parameters) {
    return (
      <>
        <div className="center-spinner">
          <Loader type="ThreeDots" color="#00BFFF" height={100} width={100} />
        </div>
      </>
    );
  }

  // if session has ended - show the Result page
  return ended ? (
    <Results score={score} aid={location.aid ? location.aid : parsed.aid} />
  ) : (
    <>
      <div class="parent-experiment">
        {/*
        SCORE Page, discontinued - currently not in use
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
        </div>*/}

        {/** The top part of the main experiment page */}
        <div className="div1-experiment">
          <TopConsole
            userAutoMode={autoMode}
            autoMode={autoMode}
            onChange={modeChange}
            isMoving={isMoving}
            obstaclesNum={obstaclesNum}
            started={started}
            score={score}
            autoAssist={parameters.autoAssist ?? "AutoAssist"}
          />
        </div>

        {/** The calculator part of the main experiment page */}
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

        {/** The vehicle steering part of the main experiment page (bottom) */}
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
            timeoutComputerDecision={parameters.timeoutComputerDecision}
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
            obstacles={obstaclesNum + 1}
            autoAssist={parameters.autoAssist ?? "AutoAssist"}
          />
        </div>
        {process.env.REACT_APP_AUTH_DOMAIN ==
        "driving-simulator-tau-test.firebaseapp.com" ? (
          <p>
            sessionid for debug (will appear only on TEST domain): {sessionId},
            location aid: {location.aid}, query string aid: {parsed.aid}
          </p>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default Experiment;
