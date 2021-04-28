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
  const [filters, setFilters] = useState(["I##U"]); // deafult type
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
      filters: filters,
      types: types,
    }).then(
      () => setName(""),
      setTitles([""]),
      setAnswers([""]),
      setFilters(["I##U"]),
      setTypes(["default"])
    ); //".then" will reset the form to nothing
  };

  const clear = () => {
    setName("");
    setTitles([""]);
    setAnswers([""]);
    setFilters(["I##U"]), setTypes(["default"]);
  };

  const questionItems = titles.map((title, i) => {
    return (
      <>
        <hr></hr>

        <span>Questions Number {i + 1}</span>
        <Button
          variant="link"
          onClick={() => {
            deleteQuestion(i);
          }}
        >
          Delete Question {i + 1}
        </Button>
        <div>
          <label>Title</label>
          <textarea
            className="input-settings"
            type="text"
            value={titles[i]}
            onChange={(e) => onChange(e, setTitles, titles, i)}
            name="titles"
          />
        </div>
        <div>
          <label>Type </label>
          <select
            className="input-settings"
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
            onChange={(e) =>
              onChange(
                {
                  target: {
                    name: "answers",
                    value: e.target.value.replace(", ", ","),
                  },
                },
                setAnswers,
                answers,
                i
              )
            }
            name="answers"
          />
        </div>
        <div>
          <label>Filter</label>
          <input
            className="input-settings"
            type="text"
            value={filters[i].split("#")[1]}
            onChange={(e) =>
              onChange(
                {
                  target: {
                    name: "filters",
                    value:
                      filters[i].slice(0, 2) +
                      e.target.value +
                      filters[i].slice(-2),
                  },
                },
                setFilters,
                filters,
                i
              )
            }
            name="filters"
          />
        </div>
        {filters[i].split("#")[1] ? (
          <>
            <div>
              <label>Redirect</label>
              <select
                className="input-settings"
                name="redirect"
                id="redirect"
                defaultValue={filters[i].slice(-1)}
                onChange={(e) =>
                  onChange(
                    {
                      target: {
                        name: "filters",
                        value: filters[i].slice(0, -1) + e.target.value,
                      },
                    },
                    setFilters,
                    filters,
                    i
                  )
                }
              >
                <option value="U">Demographic</option>
                <option value="A">Lack of attention</option>
              </select>
            </div>
            <div>
              <label>Filter Type</label>
              <select
                className="input-settings"
                name="filter-type"
                id="filter-type"
                defaultValue={filters[i].slice(0, 1)}
                onChange={(e) =>
                  onChange(
                    {
                      target: {
                        name: "filters",
                        value: e.target.value + filters[i].slice(1),
                      },
                    },
                    setFilters,
                    filters,
                    i
                  )
                }
              >
                <option value="M">Math Operation </option>
                <option value="I">Includes</option>
              </select>
            </div>
          </>
        ) : (
          <></>
        )}

        {"  "}
        <Button
          variant="link"
          onClick={() => {
            addQuestion(i);
          }}
        >
          Add Below
        </Button>
      </>
    );
  });

  const deleteQuestion = (i) => {
    let titlesCopy = titles.slice();
    let typesCopy = types.slice();
    let answersCopy = answers.slice();
    let filtersCopy = filters.slice();
    titlesCopy.splice(i, 1);
    typesCopy.splice(i, 1);
    answersCopy.splice(i, 1);
    filtersCopy.splice(i, 1);
    setTitles(titlesCopy);
    setTypes(typesCopy);
    setAnswers(answersCopy);
    setFilters(filtersCopy);
  };

  const addQuestion = (i) => {
    let titlesCopy = titles.slice();
    let typesCopy = types.slice();
    let answersCopy = answers.slice();
    let filtersCopy = filters.slice();
    titlesCopy.splice(i + 1, 0, "");
    typesCopy.splice(i + 1, 0, "");
    answersCopy.splice(i + 1, 0, "");
    filtersCopy.splice(i + 1, 0, "");
    setTitles(titlesCopy);
    setTypes(typesCopy);
    setAnswers(answersCopy);
    setFilters(filtersCopy);
  };

  return (
    <>
      <br />
      <Button
        onClick={() => {
          setTitles([...titles, ""]);
          setAnswers([...answers, ""]);
          setFilters([...filters, "I##U"]);
          setTypes([...types, ""]);
        }}
      >
        +
      </Button>
      {"  "}
      <Button
        onClick={() => {
          setTitles(titles.slice(0, -1));
          setAnswers(answers.slice(0, -1));
          setFilters(filters.slice(0, -1));
          setTypes(types.slice(0, -1));
        }}
      >
        -
      </Button>

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
