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
import "../components/driveConsole.css";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";

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

function StartButton({ onClick, className }) {
  return (
    <>
      <Button onClick={() => onClick()} variant="success" className={className}>
        <h1>Press to Start</h1>
      </Button>
    </>
  );
}

// this currently doesnt get re-render so ill need to use the hazard as a re-render
function RescueButton({ onClick, disabled, className, rescueScore }) {
  return (
    <>
      <Button
        onClick={() => onClick("rescue")}
        variant="danger"
        className={className}
        disabled={disabled}
      >
        <p>Rescue</p>
        <Badge variant="dark">{rescueScore}</Badge>
      </Button>
    </>
  );
}

function Counter({ number }) {
  return (
    <>
      <div className="counter" draggable={false}>
        <p className="counter-text">{number}</p>
      </div>
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
}) {
  //const capitalizedDirection = {
  // src: direction.charAt(0).toUpperCase() + direction.slice(1),
  // };
  // const imageName = require(`../assets/arrow-${direction}.png`);

  const directionDictionary = { left: "<", forward: "^", right: ">" };
  return (
    /**className={`arrow-${direction} estimate-${direction}`}
     * className={`arrow-${direction} progress-${direction}`}
     */ <>
      <div className={statsDivClassName}>
        <ListGroup className="stats-info">
          {!autoMode && !isMoving && (
            <ListGroup.Item action variant="primary" className="stats-info">
              {/*Computer Assesment:&nbsp;*/}
              {Math.round((estimate + Number.EPSILON) * 100)}%
            </ListGroup.Item>
          )}
          {!isMoving && (
            <ListGroup.Item action variant="dark">
              <ProgressBar
                striped
                now={progressBar * 100}
                className={className}
              />
            </ListGroup.Item>
          )}
        </ListGroup>
      </div>

      {/*<input
        disabled={autoMode || isMoving}
        draggable="false"
        type="image"
        src={imageName}
        className={className}
        onClick={() => onClick(direction)}
      />*/}
      <div className={divClassName}>
        <Button
          onClick={() => onClick(direction)}
          variant="primary"
          className={className}
          disabled={autoMode || isMoving}
        >
          <h1>{directionDictionary[direction]}</h1>
          <Badge variant="danger">{failScore}</Badge>&nbsp;/&nbsp;
          <Badge variant="success">{successScore}</Badge>
        </Button>
      </div>
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
  obstacles,
}) {
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
        2000
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
          ? onChange["scoreAddition"](scoreBoard.success + scoreBoard.pass)
          : onChange["scoreAddition"](scoreBoard.fail + scoreBoard.pass);
        break;
      case "left":
        rnd >= currentObstacle.real_l
          ? onChange["scoreAddition"](scoreBoard.success + scoreBoard.pass)
          : onChange["scoreAddition"](scoreBoard.fail + scoreBoard.pass);
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

      {/**<Counter number={obstacles} />

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
        <StartButton onClick={startOnClick} className="start-button" />
      )}
      **/}
    </>
  );
}

export default DriveConsole;
