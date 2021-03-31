import React, { useState } from "react";
import AutonomousCarImage from "../assets/autonomous-vehicles.png";
import Button from "react-bootstrap/Button";

/** Displays the results at the end of the experiment, with a goodbye message */
function Results({ score, aid }) {
  return (
    <>
      <div className="results-page">
        <h1>Thank you! We appreciate your time and effort</h1>
        <hr />
        <Button
          size="lg"
          type="button"
          variant="light"
          href={`https://app.cloudresearch.com/Router/End?aid=${aid}`}
        >
          Finish
        </Button>
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
