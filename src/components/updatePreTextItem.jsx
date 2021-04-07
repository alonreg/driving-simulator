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
    updateItem({ currentItem }, item);

    // reset all fields
    setCurrentItem({
      id: "",
      titles: [""],
      bodyList: [""],
      images: [""],
    });
    setPage(0);
  };

  // The pagination settings
  const pageButtons = item.bodyList.map((page, i) => (
    <Button onClick={() => setPage(i)}>{i + 1}</Button>
  ));

  return (
    <>
      <br />
      <ButtonToolbar aria-label="Toolbar with button groups">
        <ButtonGroup className="mr-2" aria-label="First group">
          {pageButtons}
          <Button
            onClick={() => {
              setItem({
                id: item.id,
                titles: [...item.titles, ""],
                bodyList: [...item.bodyList, ""],
                images: [...item.images, ""],
              });
              setPage(page + 1);
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
                bodyList: item.bodyList.slice(0, -1),
                images: item.images.slice(0, -1),
              });
            }}
          >
            -
          </Button>
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
            <label>Page Number</label>
            <input
              className="input-settings"
              placeholder="0"
              value={page + 1}
              name="page"
              type="text"
              disabled
            />
          </div>
          <hr />
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
            <label>Image URL</label>
            <textarea
              cols="80"
              rows="1"
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
          className="input-settings"
          onClick={() => {
            setCurrentItem({
              id: "",
              titles: [""],
              bodyList: [""],
              images: [""],
            });
            setPage(0);
          }}
        >
          clear
        </Button>
      </form>
    </>
  );
};
export default UpdatePreTextItem;
