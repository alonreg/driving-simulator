import React, { useState } from "react";

function Results({ score, obstacles }) {
  return (
    <>
      <div className="results-page">
        <h1>Thank you for your participation!</h1>
        <h1>You encountered {obstacles} obstacles, and your final score is:</h1>
        <h1>{score}</h1>
      </div>
    </>
  );
}

export default Results;
