import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";

function Results({ score, obstacles }) {
  return (
    <>
      <div className="results-page">
        <Alert variant="primary ">
          <Alert.Heading>
            Thank you! We appreciate your time and effort
          </Alert.Heading>
          <p>
            By participating in this experiment, you helped advance scientific
            research.
          </p>
          <hr />
          <p className="mb-0">
            By the way, your final score is: {score}.{" "}
            {score > 0 ? "Nice work!" : "What a bumpy ride!"}
          </p>
        </Alert>
      </div>
    </>
  );
}

export default Results;
