import Switch from "react-switch";
import React, { useState } from "react";
import { db } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import drivingGif from "../assets/endless_road.gif";
import drivingPaused from "../assets/endless_road.jpg";

import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

function TopConsole(props) {
  // const [checked, setChecked] = useState({ status: true });

  const func = () => {
    //console.log(checked["status"]);
  };

  const handleChange = (event, newAutoMode) =>
    props.onChange(newAutoMode == "auto"); //setChecked({ status: checked });

  return (
    <>
      {props.isMoving && props.started ? (
        <img draggable={false} src={drivingGif} className="driving-gif" />
      ) : (
        <img draggable={false} src={drivingPaused} className="driving-gif" />
      )}
      <p>
        {!props.started
          ? "Press Start"
          : !props.isMoving
          ? "Obstacle Detected"
          : "Vehicle is moving"}
      </p>

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
      <ToggleButtonGroup
        value={props.userAutoMode ? "auto" : "manual"}
        exclusive
        onChange={handleChange}
        aria-label="text alignment"
      >
        <ToggleButton
          value="auto"
          aria-label="auto"
          disabled={!props.isMoving || !props.started}
          className="no-outline"
        >
          <DirectionsCarIcon />
          AUTO
        </ToggleButton>
        <ToggleButton
          value="manual"
          aria-label="manual"
          disabled={!props.isMoving || !props.started}
          className="no-outline"
        >
          <EmojiPeopleIcon /> MAN
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}

export default TopConsole;
