import React, { useState } from "react";

function Results({ score, obstacles }) {
  return (
    <>
      <div className="hazard">
        <h1>Thank you for participating!</h1>
        {""}
        <h1>Your final score is:</h1>
        <h1>
          {score} with {obstacles} obstacles
        </h1>
      </div>
    </>
  );
}

export default Results;
