import Switch from "react-switch";
import React, { useState } from "react";
import { db } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TopConsole(props) {
  const [checked, setChecked] = useState({ status: true });

  const func = () => {
    console.log(checked["status"]);
  };

  const handleChange = (checked) => props.onChange(checked); //setChecked({ status: checked });
  const notify = () => toast("Wow so easy !");

  return (
    <>
      <h1>{props.isMoving ? "Driving..." : "Oops, we hit an obstacle"}</h1>
      <h1>{props.autoMode ? "comp" : "human"}</h1>
      <label className="switch">
        <span>Driving Mode</span>
        <br />
        <Switch
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
          checked={props.autoMode}
        />
      </label>
    </>
  );
}

export default TopConsole;
