import React, { useState } from "react";
import { PassThrough } from "stream";
import { db } from "../firebase";
import useCustomForm from "../hooks/useCustomForm.jsx";
import "./calculator.css";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

function Calculator(props) {
  const generateMathProblem = () => [
    Math.floor(Math.random() * 900 + 100),
    Math.random() < 0.5
      ? Math.floor(Math.random() * 90 + 10)
      : Math.floor(Math.random() * 90 + 10) * -1,
  ];

  const [problemParameters, setParameters] = useState(generateMathProblem());

  const initialValues = {
    answer: "",
  };

  function allowNumbersOnly(e) {
    var code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  }

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useCustomForm({
    initialValues,
    onSubmit: (values) => {
      if (values.values.answer == problemParameters[0] + problemParameters[1]) {
        props.onChange(props.scoreBoard.calculation);
        props.addToLog("calcSuccess", "human");
        props.addSuccessFailToSessionData("calcSuccess");
        setParameters(generateMathProblem());
      } else if (values.values.answer) {
        props.onChange(0);
        props.addToLog("calcSuccess", "human");
        props.addSuccessFailToSessionData("calcFail");
        setParameters(generateMathProblem());
      }
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit} id="input" className="form-calc">
        <div className="parent-calc">
          <div className="div1-calc">
            <h1 className="calc-text">
              {problemParameters[1] > 0
                ? problemParameters[0] + " + " + problemParameters[1] + " = "
                : problemParameters[0] +
                  " - " +
                  problemParameters[1] * -1 +
                  " = "}
            </h1>
          </div>
          <div className="div2-calc">
            <input
              className="inputRounded calculator-input"
              type="number"
              name="answer"
              onKeyPress={() => false}
              onChange={handleChange}
              value={values.answer}
              disabled={!props.started}
              autoComplete="off"
            />
          </div>
          <div className="div3-calc">
            {" "}
            <Button
              variant="primary"
              className="calculator-submit"
              type="submit"
              disabled={!props.started}
            >
              Submit{" "}
              <Badge variant="success">{props.scoreBoard.calculation}</Badge>
            </Button>
          </div>
        </div>
        {"    "}
      </form>
    </>
  );
}

export default Calculator;
