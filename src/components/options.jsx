import React, { useEffect } from "react";
import "./informationPage.css";
import Likert from "react-likert-scale";

/** A function to handle the questions at the end of the pre-experiment part
 * This function displays the options for each question
 */
const Options = ({ currentPage, questionsData, questionsState, setAnswer }) => {
  const setCurrentAnswer = (value) => {
    const newQuestionsState = [...questionsState];
    newQuestionsState[currentPage] = value.text
      ? value.text
      : value.target.value;
    console.log(newQuestionsState);
    setAnswer(newQuestionsState);
  };

  const currentAnswers = questionsData.answers[currentPage];
  const currentAnswersState = questionsState[currentPage];
  const currentType = questionsData.types[currentPage];
  const currentFilter = questionsData.filters[currentPage];

  // A likert scale that returns the string value of each choise
  const likertStrings = {
    responses: currentAnswers.split(",").map((question) => ({
      value: question,
      text: question,
      checked: currentAnswersState == question,
    })),
    onChange: setCurrentAnswer,
    class: "likert",
  };

  // A likert scale that returns the integer value of each choise
  // Choosing the best option will return the highest index value
  var likertIntegers = {
    id: questionsData.titles[currentPage],
    responses: questionsData.answers[currentPage]
      .split(",")
      .map((question, i) => ({
        value: i + 1,
        text: question,
        checked: false,
      })),
    onChange: (val) => setCurrentAnswer({ text: val.value }),
    flexible: true,
  };

  if (currentType.includes("likert")) {
    return (
      <>
        <div className="likert">
          {currentType == "likertIntegers" ? (
            <Likert {...likertIntegers} />
          ) : (
            <Likert {...likertStrings} />
          )}
        </div>
        <br></br>
      </>
    );
  } else if (currentType == "textbox") {
    return (
      <>
        <form onChange={setCurrentAnswer}>
          <div className="poll-option">
            <textarea
              id={currentAnswers}
              name={currentAnswers}
              rows="4"
              cols="50"
            ></textarea>
          </div>
        </form>
        <br></br>
      </>
    );
  } else {
    return (
      <>
        <form onChange={setCurrentAnswer}>
          <div className="poll-option">
            {currentAnswers.split(",").map((question) => (
              <>
                <input
                  type="radio"
                  id={question}
                  name={question}
                  value={question}
                  checked={currentAnswersState == question}
                />
                <label className="poll-label" htmlFor={question}>
                  {" " + question}
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
};

export default Options;
