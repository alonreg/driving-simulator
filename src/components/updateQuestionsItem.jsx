import { Divider } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

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
      types: [],
    });
  };

  const questionItems = item.titles.map((title, i) => {
    return (
      <>
        <hr></hr>

        <p>Questions Number {i + 1}</p>
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
          <label>Type </label>
          {"   "}
          <select
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
      </>
    );
  });

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
              types: [],
            });
          }}
        >
          Delete (...)
        </Button>
      </form>
    </>
  );
};
export default UpdateQuestionsItem;
