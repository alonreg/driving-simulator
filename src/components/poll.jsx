import React, { useState } from "react";

function Poll({ questions, pollStatus, setCurrentAnswer, currentChecked }) {
  return (
    <>
      <form onChange={setCurrentAnswer}>
        {questions.map((question) => (
          <>
            <input
              type="radio"
              id={question}
              name={question}
              value={question}
              checked={currentChecked == question}
            />
            <label for={question}>{question}</label>
            <br></br>
          </>
        ))}
      </form>
      <br></br>
    </>
  );
}

export default Poll;
