import React, { useState } from "react";
import { PassThrough } from "stream";
import { db } from "../firebase";
import useCustomForm from "../hooks/useCustomForm.jsx";
import "./calculator.css";
import Button from "react-bootstrap/Button";

function Calculator(props) {
  const generateMathProblem = () => [
    Math.floor(Math.random() * 9 + 1),
    Math.floor(Math.random() * 900 + 100),
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
      values.values.answer == problemParameters[0] + problemParameters[1]
        ? props.onChange(20) //change scoring to get properties from db
        : props.onChange(0);
      setParameters(generateMathProblem());
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit} id="input">
        <h1>{problemParameters[0] + " + " + problemParameters[1] + " = "}</h1>
        <input
          className="inputRounded calculator"
          type="text"
          name="answer"
          onKeyPress={() => false}
          onChange={handleChange}
          value={values.answer}
        />
        <br />
        <br />
        {"    "}
        <Button variant="primary" size="lg" type="submit">
          Submit
        </Button>
        {"    "}
      </form>
    </>
  );
}

export default Calculator;
