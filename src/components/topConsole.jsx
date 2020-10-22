import Switch from "react-switch";
import React, { useState } from "react";
import { db } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import drivingGif from "../assets/endless_road.gif";
import drivingPaused from "../assets/endless_road.jpg";

function TopConsole(props) {
  // const [checked, setChecked] = useState({ status: true });

  const func = () => {
    //console.log(checked["status"]);
  };

  const handleChange = (checked) => props.onChange(checked); //setChecked({ status: checked });
  const notify = () => toast("Wow so easy !");

  return (
    <>
      {props.isMoving && props.started ? (
        <img draggable={false} src={drivingGif} className="driving-gif" />
      ) : (
        <img draggable={false} src={drivingPaused} className="driving-gif" />
      )}
      <h1>
        {props.isMoving
          ? "Driving..."
          : props.started
          ? "Oops, we hit an obstacle"
          : "Press Start"}
      </h1>
      <p>obstacles: {props.obstaclesNum}</p>
      <label className="switch">
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
                height: "100%",
                fontSize: 22,
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
                height: "100%",
                fontSize: 24,
                color: "white",
                paddingRight: 2,
              }}
            >
              Auto
            </div>
          }
          height={70}
          width={150}
          onColor="#0080FF"
          onChange={handleChange}
          checked={props.userAutoMode}
        />
      </label>
    </>
  );
}

export default TopConsole;
