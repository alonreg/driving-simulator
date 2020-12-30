import { Divider } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

const UpdatePreTextItem = ({ currentItem, updateItem, setCurrentItem }) => {
  const [item, setItem] = useState(currentItem);
  const [page, setPage] = useState(0);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (value == "true") {
      setItem({ ...item, [name]: true });
      return;
    } else if (value == "false") {
      setItem({ ...item, [name]: false });
      return;
    }

    let itemCopy = { ...item };
    let nameArrayCopy = [...itemCopy[name]];
    nameArrayCopy[page] = value;
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
    setCurrentItem({
      id: "-",
      titles: [],
      bodyList: [],
      images: [],
    });
  };

  const pageButtons = item.bodyList.map((page, i) => (
    <Button onClick={() => setPage(i)}>{i + 1}</Button>
  ));

  return (
    <>
      <br />
      <ButtonToolbar aria-label="Toolbar with button groups">
        <ButtonGroup className="mr-2" aria-label="First group">
          {pageButtons}
        </ButtonGroup>
      </ButtonToolbar>

      <form onSubmit={onSubmit}>
        <div>
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

          <div>
            <label>Title</label>
            <textarea
              cols="80"
              rows="1"
              className="input-settings"
              value={item.titles[page]}
              name="titles"
              onChange={onChange}
              type="text"
            />
          </div>
          <div>
            <label>body</label>
            <textarea
              rows="10"
              cols="80"
              className="input-settings"
              value={item.bodyList[page]}
              name="bodyList"
              onChange={onChange}
              type="text"
            />
          </div>
          <div>
            <label>Image</label>
            <input
              className="input-settings"
              value={item.images[page]}
              name="images"
              onChange={onChange}
              type="text"
            />
          </div>
        </div>
        <Button type="submit" variant="success" className="input-settings">
          Update
        </Button>
        <Button
          className="input-settings "
          onClick={() =>
            setCurrentItem({
              id: "-",
              titles: [""],
              bodyList: [""],
              images: [""],
            })
          }
        >
          clear
        </Button>
        {/*
       <Button className="input-settings " onClick={() => setEditing(false)}>
          Remove
        </Button>
       */}
      </form>
    </>
  );
};
export default UpdatePreTextItem;
