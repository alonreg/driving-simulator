import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

const UpdateItem = ({ setEditing, currentItem, updateItem }) => {
  const [item, setItem] = useState(currentItem);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (value == "true") {
      setItem({ ...item, [name]: true });
      return;
    } else if (value == "false") {
      setItem({ ...item, [name]: false });
      return;
    }
    setItem({ ...item, [name]: +value || value });
  };

  useEffect(() => {
    setItem(currentItem);
  }, [currentItem]);

  const onSubmit = (e) => {
    e.preventDefault();
    //delete currentItem.name;
    updateItem({ currentItem }, item);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          <label>Setting Name</label>
          <input
            className="input-settings"
            type="text"
            value={item.id}
            name="name"
            disabled
          />
        </div>
        <div>
          <label>Vehicle Error</label>
          <input
            className="input-settings"
            type="number"
            value={+item.computerError}
            onChange={onChange}
            name="computerError"
          />
        </div>
        <div>
          <label>Human Error</label>
          <input
            className="input-settings"
            type="number"
            value={+item.humanError}
            onChange={onChange}
            name="humanError"
          />
        </div>
        <div>
          <label>Num. Of Obst.</label>
          <input
            className="input-settings"
            type="number"
            value={+item.obstaclesNum}
            onChange={onChange}
            name="obstaclesNum"
          />
        </div>
        <div>
          <label>Auto Mode First?</label>
          <select
            className="input-settings"
            name="startWithAuto"
            value={item.startWithAuto}
            onChange={onChange}
          >
            <option name="true">true</option>
            <option name="false">false</option>
          </select>
        </div>
        <hr />

        <div>
          <label>Calculation</label>
          <input
            className="input-settings"
            type="number"
            value={+item.calculation}
            onChange={onChange}
            name="calculation"
          />
          <label>Fail</label>
          <input
            className="input-settings"
            type="number"
            value={+item.fail}
            onChange={onChange}
            name="fail"
          />
          <label>Pass</label>
          <input
            className="input-settings"
            type="number"
            value={+item.pass}
            onChange={onChange}
            name="pass"
          />{" "}
          <label>Rescue</label>
          <input
            className="input-settings"
            type="number"
            value={+item.rescue}
            onChange={onChange}
            name="rescue"
          />{" "}
          <label>Success</label>
          <input
            className="input-settings"
            type="number"
            value={+item.success}
            onChange={onChange}
            name="success"
          />
        </div>
        <hr />

        <div>
          <label>Decision (ms)</label>
          <input
            className="input-settings"
            type="number"
            value={+item.timeoutComputerDecision}
            onChange={onChange}
            name="timeoutComputerDecision"
          />
          <label>Wait max (ms)</label>
          <input
            className="input-settings"
            type="number"
            value={+item.timeoutNextObstacleFloor}
            onChange={onChange}
            name="timeoutNextObstacleFloor"
          />
          <label>Wait min (ms)</label>
          <input
            className="input-settings"
            type="number"
            value={+item.timeoutNextObstacleMax}
            onChange={onChange}
            name="timeoutNextObstacleMax"
          />
        </div>
        <hr />
        <div>
          <label>k value</label>
          <input
            className="input-settings"
            type="number"
            value={+item.kValue}
            onChange={onChange}
            name="kValue"
          />
        </div>
        <Button type="submit" variant="success" className="input-settings">
          Update
        </Button>
        <Button className="input-settings " onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </form>
    </>
  );
};
export default UpdateItem;
