import React, { useState } from "react";
import firebase from "firebase";
import * as FirestoreService from "../firebase";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

/** This component holds a form to add new pre-experiment sets. */
const AddQuestionsForm = () => {
  const [name, setName] = useState("");
  const [titles, setTitles] = useState([""]);
  const [answers, setAnswers] = useState([""]);
  const [types, setTypes] = useState(["default"]);

  const onChange = (e, setItem, item, i) => {
    /** This functions creates a copy of the array and replaces it */
    const { name, value } = e.target;
    let arrayCopy = item.slice();
    arrayCopy[i] = value;
    setItem(arrayCopy);
  };

  const onSubmit = (e) => {
    /* 
    preventDefault is important because it
    prevents the whole page from reloading
    */
    e.preventDefault();
    if (name == "" || titles == null || answers == null || types == null) {
      window.alert("Empty field detected. Please fill all fields.");
      return;
    }

    FirestoreService.setQuestions(name, {
      id: name,
      titles: titles,
      answers: answers,
      types: types,
    }).then(
      () => setName(""),
      setTitles([""]),
      setAnswers([""]),
      setTypes(["default"])
    ); //".then" will reset the form to nothing
  };

  const clear = () => {
    setName("");
    setTitles([""]);
    setAnswers([""]);
    setTypes([""]);
  };

  const questionItems = titles.map((title, i) => {
    return (
      <>
        <hr></hr>

        <p>Questions Number {i + 1}</p>
        <div>
          <label>Title</label>
          <input
            className="input-settings"
            type="text"
            value={titles[i]}
            onChange={(e) => onChange(e, setTitles, titles, i)}
            name="titles"
          />
        </div>
        <div>
          <label>Type </label>
          {"   "}
          <select
            name="types"
            id="types"
            defaultValue={types[i]}
            onChange={(e) => onChange(e, setTypes, types, i)}
          >
            <option value="default">Default</option>
            <option value="likertIntegers">Likert Scale (Integers)</option>
            <option value="likertStrings">Likert Scale (Strings)</option>
            <option value="textbox">Text Box</option>
          </select>
        </div>
        <div>
          <label>Answers</label>
          <input
            className="input-settings"
            type="text"
            value={answers[i]}
            onChange={(e) => onChange(e, setAnswers, answers, i)}
            name="answers"
          />
        </div>
      </>
    );
  });

  return (
    <>
      <br />
      <ButtonToolbar aria-label="Toolbar with button groups">
        <ButtonGroup className="mr-2" aria-label="First group">
          <Button
            onClick={() => {
              setTitles([...titles, ""]);
              setAnswers([...answers, ""]);
              setTypes([...types, ""]);
            }}
          >
            +
          </Button>
        </ButtonGroup>
      </ButtonToolbar>

      <form onSubmit={onSubmit}>
        <div className="input-div">
          <div className="inside-input-div">
            <label>ID</label>
            <input
              className="input-settings"
              placeholder="set name"
              value={name}
              name="id"
              onChange={(e) => setName(e.currentTarget.value)}
              type="text"
            />
          </div>
          <div>{questionItems}</div>
        </div>
        <div>
          <Button type="submit" variant="success" className="input-settings">
            Submit
          </Button>
          <Button
            onClick={() => clear()}
            variant="primary"
            className="input-settings"
          >
            Clear
          </Button>
        </div>
      </form>
    </>
  );
};
export default AddQuestionsForm;
