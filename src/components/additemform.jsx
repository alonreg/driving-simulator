import React, { useState } from "react";
import firebase from "firebase";
import * as FirestoreService from "../firebase";
import Button from "react-bootstrap/Button";

/** This component is in charge of the Add Parameters part at the Settings. It contains a form and buttons */
const AddItemForm = () => {
  // All state parameters hold the state of the matching variable.
  const [name, setName] = useState("");
  const [computerError, setComputerError] = useState(null);
  const [humanError, setHumanError] = useState(null);
  const [obstaclesNum, setObstaclesNum] = useState(null);
  const [startWithAuto, setStartWithAuto] = useState(true);
  const [calculation, setCalculation] = useState(null);
  const [fail, setFail] = useState(null);
  const [pass, setPass] = useState(null);
  const [rescue, setRescue] = useState(null);
  const [success, setSuccess] = useState(null);
  const [timeoutComputerDecision, setTimeoutComputerDecision] = useState(null);
  const [timeoutNextObstacleFloor, setTimeoutNextObstacleFloor] = useState(
    null
  );
  const [timeoutNextObstacleMax, setTimeoutNextObstacleMax] = useState(null);
  const [kValue, setKValue] = useState(null);

  /* The onSubmit function we takes the 'e'
    or event and submits it to Firebase
    */
  const onSubmit = (e) => {
    /* 
    preventDefault is important because it
    prevents the whole page from reloading
    */
    e.preventDefault();
    if (
      name == "" ||
      computerError == null ||
      humanError == null ||
      obstaclesNum == null ||
      startWithAuto == null ||
      calculation == null ||
      fail == null ||
      pass == null ||
      rescue == null ||
      success == null ||
      timeoutComputerDecision == null ||
      timeoutNextObstacleFloor == null ||
      timeoutNextObstacleMax == null ||
      kValue == null
    ) {
      window.alert("Empty field detected. Please fill all fields.");
      return;
    }
    /** this function uploads the new parameters set to  */
    FirestoreService.setParameters(name, {
      computerError: +computerError,
      humanError: +humanError,
      obstaclesNum: +obstaclesNum,
      startWithAuto: startWithAuto == "true" && startWithAuto ? true : false,
      calculation: +calculation,
      fail: +fail,
      pass: +pass,
      rescue: +rescue,
      success: +success,
      timeoutComputerDecision: +timeoutComputerDecision,
      timeoutNextObstacleFloor: +timeoutNextObstacleFloor,
      timeoutNextObstacleMax: +timeoutNextObstacleMax,
      kValue: +kValue,
      randomValues: [-2.5, 2.5],
    })
      //".then" will reset the form to nothing
      .then(
        () => setName(""),
        setComputerError(0),
        setHumanError(0),
        setObstaclesNum(0),
        setStartWithAuto("true"),
        setCalculation(0),
        setFail(0),
        setPass(0),
        setRescue(0),
        setSuccess(0),
        setTimeoutComputerDecision(0),
        setTimeoutNextObstacleFloor(0),
        setTimeoutNextObstacleMax(0),
        setKValue(1.5)
      );
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="input-div">
        <div className="inside-input-div">
          <label>Setting Name</label>
          <input
            className="input-settings"
            placeholder="set name"
            value={name}
            name="Set Name"
            onChange={(e) => setName(e.currentTarget.value)}
            type="text"
          />
        </div>
        <div className="inside-input-div">
          <label>Vehicle Error</label>
          <input
            className="input-settings"
            placeholder="0"
            value={computerError}
            name="Vehicle Error"
            onChange={(e) => setComputerError(e.currentTarget.value)}
            type="number"
          />
        </div>
        <div className="inside-input-div">
          <label> Human Error </label>
          <input
            className="input-settings"
            placeholder="0"
            value={humanError}
            name="name"
            onChange={(e) => setHumanError(e.currentTarget.value)}
            type="number"
          />
        </div>
        <div className="inside-input-div">
          <label>Num. Of Obst. </label>
          <input
            className="input-settings"
            placeholder="50"
            value={obstaclesNum}
            name="Obstacle Number"
            onChange={(e) => setObstaclesNum(e.currentTarget.value)}
            type="number"
          />
        </div>
        <label>Auto Mode First?</label>
        <select
          className="input-settings"
          name="startWithAuto"
          value={startWithAuto}
          onChange={(e) => setStartWithAuto(e.currentTarget.value ?? "true")}
        >
          <option name="true">true</option>
          <option name="false">false</option>
        </select>
        <hr />
        <div>
          <label>Calculation</label>
          <input
            className="input-settings"
            placeholder="20"
            value={calculation}
            name="Correct Calculation Score"
            onChange={(e) => setCalculation(e.currentTarget.value)}
            type="number"
          />

          <label> Fail</label>
          <input
            className="input-settings"
            placeholder="-80"
            value={fail}
            name="Failure Score"
            onChange={(e) => setFail(e.currentTarget.value)}
            type="number"
          />

          <label>Pass</label>
          <input
            className="input-settings"
            placeholder="-10"
            value={pass}
            name="Pass Penalty (right / left)"
            onChange={(e) => setPass(e.currentTarget.value)}
            type="number"
          />

          <label>Rescue</label>
          <input
            className="input-settings"
            placeholder="-40"
            value={rescue}
            name="Rescue Penalty"
            onChange={(e) => setRescue(e.currentTarget.value)}
            type="number"
          />

          <label>Success</label>
          <input
            className="input-settings"
            placeholder="100"
            value={success}
            name="Successful Pass"
            onChange={(e) => setSuccess(e.currentTarget.value)}
            type="number"
          />
        </div>
        <hr />
        <div>
          <label>Decision (ms)</label>
          <input
            className="input-settings"
            placeholder="1000"
            value={timeoutComputerDecision}
            name="timeoutComputerDecision"
            onChange={(e) => setTimeoutComputerDecision(e.currentTarget.value)}
            type="number"
          />
          <label>Wait max (ms)</label>
          <input
            className="input-settings"
            placeholder="1000"
            value={timeoutNextObstacleFloor}
            name="timeoutNextObstacleFloor"
            onChange={(e) => setTimeoutNextObstacleFloor(e.currentTarget.value)}
            type="number"
          />
          <label>Wait min (ms)</label>
          <input
            className="input-settings"
            placeholder="1000"
            value={timeoutNextObstacleMax}
            name="timeoutNextObstacleMax"
            onChange={(e) => setTimeoutNextObstacleMax(e.currentTarget.value)}
            type="number"
          />
        </div>
        <hr />
        <div>
          <label>k value</label>
          <input
            className="input-settings"
            placeholder="1.5"
            step="any"
            value={kValue}
            name="kValue"
            onChange={(e) => setKValue(e.currentTarget.value)}
            type="number"
          />
        </div>
      </div>
      <div>
        <Button type="submit" variant="success" className="input-settings">
          Submit
        </Button>
      </div>
    </form>
  );
};
export default AddItemForm;
