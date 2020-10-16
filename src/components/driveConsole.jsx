import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import drivingGif from "../assets/endless_road.gif";
import hazard from "../assets/hazard.png";
import go from "../assets/go.png";
import Left from "../assets/arrow-left.png";
import Forward from "../assets/arrow-forward.png";
import Right from "../assets/arrow-right.png";
import ProgressBar from "react-bootstrap/ProgressBar";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

function CenterSign({ autoModeInit, isMoving, autoMode, started }) {
  useEffect(() => {
    if (autoMode && !isMoving && started) {
      //|| isFirstRun
      autoModeInit();
    }
  }, [isMoving]);

  return (
    <>
      {isMoving ? (
        <img draggable={false} src={go} className="hazard" />
      ) : (
        <img draggable={false} src={hazard} className="hazard" />
      )}
    </>
  );
}

function StartButton({ onClick }) {
  return (
    <>
      <Button
        onClick={() => onClick()}
        variant="success"
        className="hazard"
        size="lg"
      >
        Start
      </Button>
    </>
  );
}

// this currently doesnt get re-render so ill need to use the hazard as a re-render
function RescueButton({ onClick, disabled }) {
  return (
    <>
      <Button
        onClick={() => onClick("rescue")}
        variant="danger"
        className="rescue"
        disabled={disabled}
      >
        Rescue
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
}) {
  const capitalizedDirection = {
    src: direction.charAt(0).toUpperCase() + direction.slice(1),
  };
  const imageName = require(`../assets/arrow-${direction}.png`);
  return (
    <>
      {!autoMode && !isMoving ? (
        <h1
          type="button"
          className={`arrow-${direction} estimate-${direction}`}
        >
          {Math.round((estimate + Number.EPSILON) * 100)}%
        </h1>
      ) : null}
      {!isMoving ? (
        <ProgressBar
          className={`arrow-${direction} progress-${direction}`}
          striped
          now={progressBar * 100}
        />
      ) : null}
      <input
        disabled={autoMode || isMoving}
        draggable="false"
        type="image"
        src={imageName}
        className={`arrow-${direction}`}
        onClick={() => onClick(direction)}
      />
    </>
  );
}

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
}) {
  const computerDesicion = () => {
    const direction = currentObstacle?.decision ?? null;
    if (autoMode) {
      setTimeout(
        (function (localDirectionDecided) {
          return function () {
            localDirectionDecided(direction);
          };
        })(directionDecided),
        5000
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
        rnd >= currentObstacle.real_r
          ? onChange["scoreAddition"](scoreBoard.success - scoreBoard.pass)
          : onChange["scoreAddition"](scoreBoard.fail - scoreBoard.pass);
        break;
      case "left":
        rnd >= currentObstacle.real_l
          ? onChange["scoreAddition"](scoreBoard.success - scoreBoard.pass)
          : onChange["scoreAddition"](scoreBoard.fail - scoreBoard.pass);
        break;
      case "forward":
        rnd >= currentObstacle.real_f
          ? onChange["scoreAddition"](scoreBoard.success)
          : onChange["scoreAddition"](scoreBoard.fail);
        break;
      case "rescue":
        onChange["scoreAddition"](scoreBoard.rescue);
      default:
        break;
    }
    onChange["obstaclesAddition"]();
    onArrowClick();
    //onChange["obstaclesAddition"]();
    //11-12-2020 - alon!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    /*if (Math.random() > 0.5) {
        if (direction != "forward") {
          onChange["scoreAddition"](100);
        } else {
          onChange["scoreAddition"](150);
        }
      } else {
        onChange["scoreAddition"](-150);
      }*/
  };

  return (
    <>
      {started ? (
        <>
          <RescueButton
            onClick={directionDecided}
            disabled={isMoving || autoMode}
            className="rescue"
          />
          <Arrow
            key="123"
            direction="left"
            onClick={directionDecided}
            progressBar={currentObstacle?.obstacleValueWithError_human_l ?? 50}
            estimate={currentObstacle?.obstacleValueWithError_computer_l ?? 0}
            autoMode={autoMode}
            isMoving={isMoving}
          />
          <Arrow
            direction="right"
            onClick={directionDecided}
            progressBar={currentObstacle?.obstacleValueWithError_human_r ?? 0}
            estimate={currentObstacle?.obstacleValueWithError_computer_r ?? 0}
            autoMode={autoMode}
            isMoving={isMoving}
          />
          <Arrow
            direction="forward"
            onClick={directionDecided}
            progressBar={currentObstacle?.obstacleValueWithError_human_f ?? 0}
            estimate={currentObstacle?.obstacleValueWithError_computer_f ?? 0}
            autoMode={autoMode}
            isMoving={isMoving}
          />
          <CenterSign
            autoModeInit={computerDesicion}
            isMoving={isMoving}
            autoMode={autoMode}
            started={started}
          />
        </>
      ) : (
        <StartButton onClick={startOnClick} className="lg" />
      )}
    </>
  );
}

export default DriveConsole;
