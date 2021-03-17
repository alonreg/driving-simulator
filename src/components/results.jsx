import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import AutonomousCarImage from "../assets/autonomous-vehicles.png";

/** Displays the results at the end of the experiment, with a goodbye message */
function Results({ score, obstacles }) {
  return (
    <>
      <div className="results-page">
        <h1>Thank you! We appreciate your time and effort</h1>
        <hr />
        <h3>
          By participating in this experiment, you helped advance scientific
          research. You can now close this window.
        </h3>
        <hr />
        <h3 className="mb-0">
          By the way, your final score is: {score}.{" "}
          {score > 0 ? "Nice work!" : "What a bumpy ride!"}
        </h3>
        <img
          src={AutonomousCarImage}
          alt="image"
          className="results-image"
        ></img>
      </div>
    </>
  );
}

export default Results;
