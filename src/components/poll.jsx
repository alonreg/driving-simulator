import React, { useState } from "react";
import "./informationPage.css";

function Poll({ questions, pollStatus, setCurrentAnswer, currentChecked }) {
  return (
    <>
      <form onChange={setCurrentAnswer}>
        <div className="poll-option">
          {questions.map((question) => (
            <>
              <input
                type="radio"
                id={question}
                name={question}
                value={question}
                checked={currentChecked == question}
              />
              {"   "}
              <label className="poll-label" for={question}>
                <h4>{question}</h4>
              </label>
              <br></br>
            </>
          ))}
        </div>
      </form>
      <br></br>
    </>
  );
}

export default Poll;
