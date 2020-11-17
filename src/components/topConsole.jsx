import Switch from "react-switch";
import React, { useState } from "react";
import { db } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import drivingGif from "../assets/endless_road.gif";
import drivingPaused from "../assets/endless_road.jpg";
import CenterSign from "../components/centerSign.jsx";

import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import "./topConsole.css";

function TopConsole(props) {
  // const [checked, setChecked] = useState({ status: true });

  const func = () => {
    //console.log(checked["status"]);
  };

  const handleChange = (event, newAutoMode) =>
    props.onChange(newAutoMode == "auto"); //setChecked({ status: checked });

  return (
    <>
      {/**<label className="switch">
        <span>Mode</span>
        <br />
        <Switch
          disabled={!props.isMoving || !props.started}
          uncheckedIcon={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                paddingRight: 2,
              }}
            >
              Manual
            </div>
          }
          checkedIcon={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                paddingRight: 2,
              }}
            >
              Auto
            </div>
          }
          height={20}
          width={100}
          onColor="#0080FF"
          onChange={handleChange}
          checked={props.userAutoMode}
        />
        </label>**/}
      <div className="safari-div">
        <div className="parent-topConsole">
          <div className="div1-topConsole">
            <CenterSign
              className="center-sign"
              isMoving={props.isMoving}
              started={props.started}
            />
          </div>
          <div className="div2-topConsole">
            <div className="text-and-score-div">
              <div className="score-topConsole inputRounded">
                <p>{props.score}</p>
              </div>
              <p className="center-text">
                {!props.started
                  ? "Press Start"
                  : !props.isMoving
                  ? "Obstacle Detected"
                  : "Vehicle is moving"}
              </p>
            </div>
          </div>
          <div className="div3-topConsole">
            <ToggleButtonGroup
              value={props.userAutoMode ? "auto" : "manual"}
              exclusive
              onChange={handleChange}
              aria-label="text alignment"
              className="mode-toggle"
            >
              <ToggleButton
                value="auto"
                aria-label="auto"
                disabled={!props.isMoving || !props.started}
                className="mode-toggle"
              >
                <DirectionsCarIcon />
                AUTO
              </ToggleButton>
              <ToggleButton
                value="manual"
                aria-label="manual"
                disabled={!props.isMoving || !props.started}
                className="mode-toggle"
              >
                <EmojiPeopleIcon /> MAN
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className="div4-topConsole">
            {props.isMoving && props.started ? (
              <img draggable={false} src={drivingGif} className="driving-gif" />
            ) : (
              <img
                draggable={false}
                src={drivingPaused}
                className="driving-gif"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TopConsole;
