import React, { useState } from "react";

function Poll({ questions, pollStatus, setCurrentAnswer }) {
  return (
    <>
      <div onChange={setCurrentAnswer}></div>

      <form onChange={setCurrentAnswer}>
        {questions.map((question) => (
          <>
            <input
              type="radio"
              id={question}
              name="question"
              value={question}
            />
            <label for={question}>{question}</label>
            <br></br>
          </>
        ))}

        <input type="radio" id="male" name="gender" value="male" />
        <label for="male">Male</label>
      </form>
    </>
  );
}

export default Poll;
