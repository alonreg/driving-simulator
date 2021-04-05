import React, { useState } from "react";
import "./informationPage.css";

/** A function to handle the questions at the end of the pre-experiment part 
 * 
 * 
 * DELETE:
 * currentPage={pageNumber}
            questionsData={questionsData}
            questionsState={questionsState}
            setAnswer={(newState) => {
              setQuestionsState(newState);
            }}
*/
const Poll = ({ currentPage, questionsData, questionsState, setAnswer }) => {
  const setCurrentAnswer = (value) => {
    const newQuestionsState = [...questionsState];
    newQuestionsState[currentPage] = value.target.value;
    setAnswer(newQuestionsState);
  };

  return (
    <>
      <form onChange={setCurrentAnswer}>
        <div className="poll-option">
          {questionsData.answers[currentPage].split(",").map((question) => (
            <>
              <input
                type="radio"
                id={question}
                name={question}
                value={question}
                checked={questionsState[currentPage] == question}
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
};

export default Poll;
