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
import Background from "../assets/background/blue_road_with_sun_single_frame.gif";

/** The top part of the experiment where the sign, score, GIF, and modes are */
function TopConsole(props) {
  const [scoreDelta, setScoreDelta] = useState(0);
  const [oldScore, setOldScore] = useState(0);
  const [toggleText, setToggleText] = useState("");
  const [toggleClassName, setToggleClassName] = useState("");
  const [toggleTextClassName, setToggleTextClassName] = useState("");
  const [badgeClassName, setBadgeClassName] = useState("");
  const [scoreClassName, setScoreClassName] = useState("");

  const handleChange = (event, newAutoMode) => {
    props.onChange(newAutoMode == "auto"); //setChecked({ status: checked });
    console.log("handled change " + newAutoMode);
  };

  useEffect(() => {
    setScoreDelta(props.score - oldScore);
    setOldScore(props.score);
    setBadgeClassName("topConsole-badge-animation");
    if (props.score - oldScore < 0) {
      setScoreClassName("topConsole-shake-animation");
    } else if (props.score - oldScore > 0) {
      setScoreClassName("topConsole-lift-animation");
    }
  }, [props.score]);

  return (
    <>
      <div
        className="parent-topConsole"
        style={
          !props.started || !props.isMoving
            ? {
                backgroundImage: `url(${Background})`,
              }
            : {}
        }
      >
        {/* <div className="div1-topConsole">
          <CenterSign
            className="center-sign"
            isMoving={props.isMoving}
            started={props.started}
          />
        </div> */}

        {/* <div className="div4-topConsole">
          {props.isMoving && props.started ? (
            <img draggable={false} src={drivingGif} className="driving-gif" />
          ) : (
            <img
              draggable={false}
              src={drivingPaused}
              className="driving-gif"
            />
          )}
        </div> */}
        <div className="div5-topConsole"></div>
        <div className="div2-topConsole">
          <div className="text-and-score-div">
            <div
              onAnimationEnd={() => setScoreClassName("")}
              className={"score-topConsole inputRounded " + scoreClassName}
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
                  <h2 className="score-text">{props.score}</h2>
                </div>
                <div className="div1-scoreGrid"></div>
                <div
                  className={"div3-scoreGrid " + badgeClassName}
                  onAnimationEnd={() => setBadgeClassName("")}
                >
                  {" "}
                  {scoreDelta == 0 ? (
                    ""
                  ) : (
                    <h2>
                      <Badge
                        pill
                        variant={scoreDelta > 0 ? "success" : "danger"}
                      >
                        {scoreDelta > 0 ? "+" + scoreDelta : scoreDelta}
                      </Badge>
                    </h2>
                  )}
                </div>
              </div>
            </div>
            {!props.started ? (
              <p className="center-text">Press Start Below</p>
            ) : !props.isMoving ? (
              <>
                <p
                  className="center-text"
                  style={{
                    color: "rgb(247, 230, 230)",
                  }}
                >
                  Obstacle detected
                </p>
              </>
            ) : (
              <p className="center-text">Vehicle is moving</p>
            )}
          </div>
        </div>

        <div className="div3-topConsole">
          <div className="topConsole-toggle-grid">
            <div className="topConsole-toggle-grid-div1">
              {" "}
              <div
                className={"toggle-div " + toggleClassName}
                style={
                  props.isMoving && props.started
                    ? { backgroundColor: "rgba(255,244,236,0.55)" }
                    : { backgroundColor: "rgba(0,0,5,0.68)" }
                }
                onClick={() => {
                  if (!props.isMoving || !props.started) {
                    setToggleText("change mode when vehicle moves");
                    setToggleTextClassName("topConsole-toggle-text-animation");
                    setToggleClassName("topConsole-shake-animation");
                  }
                }}
                onAnimationEnd={() => setToggleClassName("")}
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
            <div className="topConsole-toggle-grid-div2">
              <p
                className={"topConsole-toggle-text " + toggleTextClassName}
                onAnimationEnd={() => setToggleTextClassName("")}
              >
                {toggleText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopConsole;
