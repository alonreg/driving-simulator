import React, { useState } from "react";
import { db } from "../firebase";
import wheel from "../assets/steering-wheel.png";
import Left from "../assets/arrow-left.png";
import Forward from "../assets/arrow-forward.png";
import Right from "../assets/arrow-right.png";
import ProgressBar from "react-bootstrap/ProgressBar";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

// A function to create an arrow image, according to a direction
function Arrow({ direction, onClick }) {
  const capitalizedDirection = {
    src: direction.charAt(0).toUpperCase() + direction.slice(1),
  };
  console.log(`${direction}`);

  const imageName = require(`../assets/arrow-${direction}.png`);
  return (
    <>
      <ProgressBar
        className={`arrow-${direction} progress-${direction}`}
        striped
        now={50}
      />
      <input
        type="image"
        src={imageName}
        className={`arrow-${direction}`}
        onClick={onClick}
      />
    </>
  );
}

function DriveConsole(props) {
  const [todos, setTodos] = useState([]);

  const chooseDirection = () => {
    props.onArrowClick();
    //props.onArrowClick(!props.isMoving);
    props.onChange(10);
  };

  return (
    <>
      {props.autoMode ? (
        <label className="arrow-left">
          <InputGroup className="mb-sm-n3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default">
                95%
              </InputGroup.Text>
            </InputGroup.Prepend>
            <input placeholder="sss" />
          </InputGroup>
        </label>
      ) : null}
      {!props.isMoving
        ? [
            <Arrow direction="left" onClick={chooseDirection} />,
            <Arrow direction="right" onClick={chooseDirection} />,
            <Arrow direction="forward" onClick={chooseDirection} />,
          ]
        : null}

      <img src={wheel} className="steering-wheel" />
    </>
  );
}

export default DriveConsole;
