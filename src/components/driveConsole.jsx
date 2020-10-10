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

function CenterSign({ autoModeInit, isMoving, autoMode, isFirstRun }) {
  useEffect(() => {
    if (autoMode && !isMoving) {
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

// this currently doesnt get re-render so ill need to use the hazard as a re-render
function RescueButton({ onClick }) {
  return (
    <>
      <Button
        onClick={() => onClick("rescue")}
        variant="danger"
        className="rescue"
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
          {estimate}%
        </h1>
      ) : null}
      {!isMoving ? (
        <ProgressBar
          className={`arrow-${direction} progress-${direction}`}
          striped
          now={progressBar}
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
}) {
  const computerDesicion = () => {
    const direction = "forward";
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
    if (direction == "rescue") {
      onArrowClick();
      //onChange["obstaclesAddition"]();
      //onChange["scoreAddition"](-100);
    } else {
      onArrowClick();
      //onChange["obstaclesAddition"]();
      if (Math.random() > 0.5) {
        if (direction != "forward") {
          onChange["scoreAddition"](100);
        } else {
          onChange["scoreAddition"](150);
        }
      } else {
        onChange["scoreAddition"](-150);
      }
    }
    onChange["obstaclesAddition"]();
  };

  return (
    <>
      <RescueButton
        onClick={directionDecided}
        className="rescue"
        autoModeInit={computerDesicion}
      />
      <Arrow
        key="123"
        direction="left"
        onClick={directionDecided}
        progressBar="40"
        estimate="70"
        autoMode={autoMode}
        isMoving={isMoving}
      />
      <Arrow
        direction="right"
        onClick={directionDecided}
        progressBar="40"
        estimate="70"
        autoMode={autoMode}
        isMoving={isMoving}
      />
      <Arrow
        direction="forward"
        onClick={directionDecided}
        progressBar={currentObstacle.humanEstimate}
        estimate={currentObstacle.computerEstimate}
        autoMode={autoMode}
        isMoving={isMoving}
      />
      <CenterSign
        autoModeInit={computerDesicion}
        isMoving={isMoving}
        autoMode={autoMode}
        isFirstRun={isFirstRun}
      />
    </>
  );
}

export default DriveConsole;
