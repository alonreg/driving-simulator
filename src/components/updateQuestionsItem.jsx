import { Divider } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { deleteQuestions } from "../firebase";

// Updates paramerters item
const UpdateQuestionsItem = ({
  currentItem,
  updateItem,
  setCurrentItem,
  deleteItem,
}) => {
  const [item, setItem] = useState(currentItem);

  const onChange = (e, i) => {
    const { name, value } = e.target;
    let itemCopy = { ...item };
    let nameArrayCopy = [...itemCopy[name]];
    nameArrayCopy[i] = value;
    itemCopy[name] = nameArrayCopy;
    setItem(itemCopy);
  };

  const onFilterTypeChange = (e, i) => {
    const { name, value } = e.target;
    let itemCopy = { ...item };
    let nameArrayCopy = [...itemCopy["filters"]];
    if (name == "filters") {
      nameArrayCopy[i] =
        nameArrayCopy[i].slice(0, 2) + value + nameArrayCopy[i].slice(-2);
    } else if (name == "redirect") {
      nameArrayCopy[i] = nameArrayCopy[i].slice(0, -1) + value;
    } else {
      nameArrayCopy[i] = value + nameArrayCopy[i].slice(1);
    }

    itemCopy["filters"] = nameArrayCopy;
    setItem(itemCopy);
  };

  useEffect(() => {
    setItem(currentItem);
  }, [currentItem]);

  const onSubmit = (e) => {
    e.preventDefault();
    //delete currentItem.name;
    updateItem({ currentItem }, item);
    // reset all fields
    setCurrentItem({
      id: "",
      titles: [],
      answers: [],
      filters: [],
      types: [],
    });
  };

  const questionItems = item.titles.map((title, i) => {
    return (
      <>
        <hr></hr>
        <span>Q{i + 1}</span>
        <Button
          variant="link"
          onClick={() => {
            deleteQuestion(i);
          }}
        >
          Delete
        </Button>
        <div>
          <label>Title</label>
          <input
            className="input-settings"
            type="text"
            value={item.titles[i]}
            onChange={(e) => onChange(e, i)}
            name="titles"
          />
        </div>
        <div>
          <label>Question Type </label>
          <select
            className="input-settings"
            name="types"
            id="types"
            defaultValue={item.types[i]}
            onChange={(e) => onChange(e, i)}
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
            value={item.answers[i]}
            onChange={(e) => onChange(e, i)}
            name="answers"
          />
        </div>
        <div>
          <label>Filters</label>
          <input
            className="input-settings"
            type="text"
            value={item.filters[i].slice(2, -2)}
            onChange={(e) => onFilterTypeChange(e, i)}
            name="filters"
          />
        </div>
        {item.filters[i].slice(2, -2) ? (
          <>
            <div>
              <label>Redirect</label>
              <select
                className="input-settings"
                name="redirect"
                id="redirect"
                defaultValue={item.filters[i].slice(-1)}
                onChange={(e) => onFilterTypeChange(e, i)}
              >
                <option value="U">Demographic</option>
                <option value="A">Lack of attention</option>
              </select>
            </div>
            <div>
              <label>Filter Type</label>
              <select
                className="input-settings"
                name="filter-types"
                id="filter-types"
                defaultValue={item.filters[i].slice(0, 1)}
                onChange={(e) => onFilterTypeChange(e, i)}
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
    let itemCopy = { ...item };
    itemCopy.titles.splice(i, 1);
    itemCopy.answers.splice(i, 1);
    itemCopy.filters.splice(i, 1);
    itemCopy.types.splice(i, 1);

    setItem({
      id: item.id,
      titles: [...itemCopy.titles],
      answers: [...itemCopy.answers],
      filters: [...itemCopy.filters],
      types: [...itemCopy.types],
    });
  };

  const addQuestion = (i) => {
    let itemCopy = { ...item };
    itemCopy.titles.splice(i + 1, 0, "");
    itemCopy.answers.splice(i + 1, 0, "");
    itemCopy.filters.splice(i + 1, 0, "");
    itemCopy.types.splice(i + 1, 0, "");

    setItem({
      id: item.id,
      titles: [...itemCopy.titles],
      answers: [...itemCopy.answers],
      filters: [...itemCopy.filters],
      types: [...itemCopy.types],
    });
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          <label>Setting Name</label>
          <input
            className="input-settings"
            type="text"
            value={item.id}
            name="name"
            disabled
          />
        </div>
        {questionItems}
        <hr></hr>
        <Button
          onClick={() => {
            setItem({
              id: item.id,
              titles: [...item.titles, ""],
              answers: [...item.answers, ""],
              filters: [...item.filters, ""],
              types: [...item.types, ""],
            });
          }}
        >
          +
        </Button>
        {"  "}

        <Button
          onClick={() => {
            setItem({
              id: item.id,
              titles: item.titles.slice(0, -1),
              answers: item.answers.slice(0, -1),
              filters: item.filters.slice(0, -1),
              types: item.types.slice(0, -1),
            });
          }}
        >
          -
        </Button>
        <hr></hr>
        <Button type="submit" variant="success" className="input-settings">
          Update
        </Button>
        <Button
          variant="danger"
          className="input-settings"
          onClick={() => {
            deleteItem({ id: item.id });
            setCurrentItem({
              id: "",
              titles: [],
              answers: [],
              filters: [],
              types: [],
            });
          }}
        >
          Delete
        </Button>
      </form>
    </>
  );
};
export default UpdateQuestionsItem;
