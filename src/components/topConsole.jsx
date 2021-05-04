import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import drivingGif from "../assets/endless_road.gif";
import drivingPaused from "../assets/endless_road.jpg";
import CenterSign from "../components/centerSign.jsx";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import Nav from "react-bootstrap/Nav";
import "./topConsole.css";
import Badge from "react-bootstrap/Badge";
import Results from "./results";

/** The top part of the experiment where the sign, score, GIF, and modes are */
function TopConsole(props) {
  const [scoreDelta, setScoreDelta] = useState(0);
  const [oldScore, setOldScore] = useState(0);

  const handleChange = (event, newAutoMode) => {
    props.onChange(newAutoMode == "auto"); //setChecked({ status: checked });
    console.log("handled change " + newAutoMode);
  };

  useEffect(() => {
    setScoreDelta(props.score - oldScore);
    setOldScore(props.score);
  }, [props.score]);

  return (
    <>
      <div className="parent-topConsole">
        <div className="div1-topConsole">
          <CenterSign
            className="center-sign"
            isMoving={props.isMoving}
            started={props.started}
          />
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

        <div className="div2-topConsole">
          <div className="text-and-score-div">
            <div
              className="score-topConsole inputRounded"
              style={
                props.isMoving && props.obstaclesNum > 0
                  ? scoreDelta > 0
                    ? { borderColor: "RGBA(0,188,34,0.80)" }
                    : { borderColor: "RGBA(187, 16, 16, 0.80)" }
                  : {}
              }
            >
              <div className="parent-scoreGrid">
                <div className="div2-scoreGrid">
                  <p className="score-text">
                    {props.score}
                    {"  "}
                  </p>
                </div>
                <div className="div3-scoreGrid">
                  {scoreDelta == 0 || !props.isMoving ? (
                    ""
                  ) : (
                    <Badge pill variant={scoreDelta > 0 ? "success" : "danger"}>
                      {scoreDelta > 0 ? "+" + scoreDelta : scoreDelta}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <p className="center-text">
              {!props.started
                ? "Press Start Below"
                : !props.isMoving
                ? "Obstacle Detected"
                : "Vehicle is moving"}
            </p>
          </div>
        </div>

        <div className="div3-topConsole">
          <div
            className="toggle-div"
            style={
              props.isMoving && props.started
                ? { backgroundColor: "RGBA(255,244,236,0.55)" }
                : { backgroundColor: "RGBA(0,0,5,0.68)" }
            }
            onClick={() => {
              if (!props.isMoving || !props.started)
                alert("You can only switch modes when the vehicle is moving");
            }}
          >
            <Nav
              variant="pills"
              defaultActiveKey={props.userAutoMode ? "auto" : "manual"}
              activeKey={props.userAutoMode ? "auto" : "manual"}
            >
              <Nav.Item color="black">
                <Nav.Link
                  draggable={false}
                  disabled={!props.isMoving || !props.started}
                  onChange={handleChange}
                  onClick={() => handleChange("_", "auto")}
                  eventKey="auto"
                >
                  <DirectionsCarIcon />
                  {props.autoAssist}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  draggable={false}
                  disabled={!props.isMoving || !props.started}
                  onChange={handleChange}
                  onClick={() => handleChange("_", "manual")}
                  eventKey="manual"
                >
                  <EmojiPeopleIcon />
                  Manual
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopConsole;
