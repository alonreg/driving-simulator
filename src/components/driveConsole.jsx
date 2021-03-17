import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import ProgressBar from "react-bootstrap/ProgressBar";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import "../components/driveConsole.css";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";

/** The initial pixel is a component that initiates the driving when in automode. */
function InitiatePixel({ autoModeInit, isMoving, autoMode, started }) {
  useEffect(() => {
    if (autoMode && !isMoving && started) {
      //|| isFirstRun
      autoModeInit();
    }
  }, [isMoving]);

  return (
    <>
      {isMoving ? (
        <></> //<img draggable={false} src={go} className="hazard" />
      ) : (
        <></> //<img draggable={false} src={hazard} className="hazard" />
      )}
    </>
  );
}

/** Start button component at the start of the experiment */
function StartButton({ onClick, className }) {
  return (
    <>
      <Button onClick={() => onClick()} variant="success" className={className}>
        <h1>Press to Start</h1>
      </Button>
    </>
  );
}

/** The rescue button */
function RescueButton({ onClick, disabled, className, rescueScore }) {
  return (
    <>
      <Button
        onClick={() => onClick("rescue")}
        variant="danger"
        className={className}
        disabled={disabled}
      >
        <div className="rescue-text-container">
          <p className="rescue-text">
            Rescue&nbsp;
            <Badge variant="dark">{rescueScore}</Badge>
          </p>
        </div>
      </Button>
    </>
  );
}

// A function to create an arrow image, according to a direction
function Arrow({
  progressBar,
  estimate,
  autoMode,
  direction,
  onClick,
  isMoving,
  className,
  divClassName,
  statsDivClassName,
  successScore,
  failScore,
  autoAssist,
}) {
  const directionDictionary = { left: "<", forward: "^", right: ">" };
  return (
    <>
      <div className={statsDivClassName}>
        {!isMoving && (
          <Alert className="alert-driveConsole" variant="warning">
            {!autoMode && !isMoving && (
              <>
                <p className="alert-text-driveConsole">
                  <i>{autoAssist}: </i>
                  <br></br>
                  <b>{Math.round((estimate + Number.EPSILON) * 100)}%</b>
                </p>
              </>
            )}

            {!isMoving && (
              <>
                <i>Human: </i>
                <ProgressBar
                  striped
                  now={progressBar * 100}
                  className={className}
                />
              </>
            )}
          </Alert>
        )}
      </div>
      <div className={divClassName}>
        <Button
          onClick={() => onClick(direction)}
          variant="primary"
          className={className}
          disabled={autoMode || isMoving}
        >
          <span className="arrow-text">{directionDictionary[direction]}</span>
          <br />
          <Badge variant="danger">{failScore}</Badge>&nbsp;
          <Badge variant="success">{successScore}</Badge>
        </Button>
      </div>
    </>
  );
}

/** DriveConsole component displays the driving console, and manages it */
function DriveConsole({
  autoMode,
  onArrowClick,
  onChange,
  currentObstacle,
  isMoving,
  isFirstRun,
  started,
  startOnClick,
  scoreBoard,
  obstacles,
  timeoutComputerDecision,
  autoAssist,
}) {
  /** Renders a direction decision for the computer when in autoMode */
  const computerDesicion = () => {
    const direction = currentObstacle?.decision ?? null;
    if (autoMode) {
      setTimeout(
        (function (localDirectionDecided) {
          return function () {
            //inputref.click() instead.
            localDirectionDecided(direction);
          };
        })(directionDecided),
        timeoutComputerDecision
      );
    }
  };

  // a user has chosen a direction (left right forward)
  const directionDecided = (direction) => {
    console.log(
      "direction decided. " +
        " direction: " +
        direction +
        " isMoving: " +
        isMoving
    );
    const rnd = Math.random();
    switch (direction) {
      case "right":
        if (rnd >= currentObstacle.real_r) {
          onChange["scoreAddition"](scoreBoard.success + scoreBoard.pass);
          onChange["addToLog"](
            "right-success",
            autoMode ? "computer" : "human"
          );
          autoMode
            ? onChange["addSuccessFailToSessionData"]("successByComp")
            : onChange["addSuccessFailToSessionData"]("successByHuman");
        } else {
          onChange["scoreAddition"](scoreBoard.fail + scoreBoard.pass);
          onChange["addToLog"]("right-fail", autoMode ? "computer" : "human");
          autoMode
            ? onChange["addSuccessFailToSessionData"]("failByComp")
            : onChange["addSuccessFailToSessionData"]("failByHuman");
        }

        break;
      case "left":
        if (rnd >= currentObstacle.real_l) {
          onChange["scoreAddition"](scoreBoard.success + scoreBoard.pass);
          onChange["addToLog"]("left-success", autoMode ? "computer" : "human");
          autoMode
            ? onChange["addSuccessFailToSessionData"]("successByComp")
            : onChange["addSuccessFailToSessionData"]("successByHuman");
        } else {
          onChange["scoreAddition"](scoreBoard.fail + scoreBoard.pass);
          onChange["addToLog"]("left-fail", autoMode ? "computer" : "human");
          autoMode
            ? onChange["addSuccessFailToSessionData"]("failByComp")
            : onChange["addSuccessFailToSessionData"]("failByHuman");
        }

        break;
      case "forward":
        if (rnd >= currentObstacle.real_f) {
          onChange["scoreAddition"](scoreBoard.success);
          onChange["addToLog"](
            "forward-success",
            autoMode ? "computer" : "human"
          );
          autoMode
            ? onChange["addSuccessFailToSessionData"]("successByComp")
            : onChange["addSuccessFailToSessionData"]("successByHuman");
        } else {
          onChange["scoreAddition"](scoreBoard.fail);
          onChange["addToLog"]("forward-fail", autoMode ? "computer" : "human");
          autoMode
            ? onChange["addSuccessFailToSessionData"]("failByComp")
            : onChange["addSuccessFailToSessionData"]("failByHuman");
        }
        break;
      case "rescue":
        onChange["scoreAddition"](scoreBoard.rescue);
        onChange["addToLog"]("rescue", autoMode ? "computer" : "human");
        onChange["addSuccessFailToSessionData"]("rescue");
      default:
        break;
    }
    onChange["obstaclesAddition"]();
    onArrowClick();
  };

  return (
    <>
      <div className="parent-drivingConsole">
        {started && (
          <>
            <InitiatePixel
              autoModeInit={computerDesicion}
              isMoving={isMoving}
              autoMode={autoMode}
              started={started}
            />
            <Arrow
              key="123"
              direction="left"
              onClick={directionDecided}
              progressBar={
                currentObstacle?.obstacleValueWithError_human_l ?? 50
              }
              estimate={currentObstacle?.obstacleValueWithError_computer_l ?? 0}
              autoMode={autoMode}
              isMoving={isMoving}
              className="arrow"
              divClassName="div1-drivingConsole"
              statsDivClassName="div6-drivingConsole"
              successScore={scoreBoard.success + scoreBoard.pass}
              failScore={scoreBoard.fail + scoreBoard.pass}
              autoAssist={autoAssist}
            />
            <Arrow
              direction="forward"
              onClick={directionDecided}
              progressBar={currentObstacle?.obstacleValueWithError_human_f ?? 0}
              estimate={currentObstacle?.obstacleValueWithError_computer_f ?? 0}
              autoMode={autoMode}
              isMoving={isMoving}
              className="arrow"
              divClassName="div2-drivingConsole"
              statsDivClassName="div7-drivingConsole"
              successScore={scoreBoard.success}
              failScore={scoreBoard.fail}
              autoAssist={autoAssist}
            />

            <Arrow
              direction="right"
              onClick={directionDecided}
              progressBar={currentObstacle?.obstacleValueWithError_human_r ?? 0}
              estimate={currentObstacle?.obstacleValueWithError_computer_r ?? 0}
              autoMode={autoMode}
              isMoving={isMoving}
              className="arrow"
              divClassName="div3-drivingConsole"
              statsDivClassName="div8-drivingConsole"
              successScore={scoreBoard.success + scoreBoard.pass}
              failScore={scoreBoard.fail + scoreBoard.pass}
              autoAssist={autoAssist}
            />

            <div className="div4-drivingConsole ">
              <div className="rescue-container">
                <RescueButton
                  onClick={directionDecided}
                  disabled={isMoving || autoMode}
                  className="rescue"
                  rescueScore={scoreBoard.rescue}
                />
              </div>
            </div>
          </>
        )}

        {!started && (
          <div className="div23-drivingConsole">
            <div className="start-button-container">
              <StartButton onClick={startOnClick} className="start-button" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DriveConsole;
