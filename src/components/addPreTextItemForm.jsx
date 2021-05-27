import React, { useState } from "react";
import * as FirestoreService from "../firebase";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

/** This component holds a form to add new pre-experiment sets. */
const AddPreTextItemForm = () => {
  const [name, setName] = useState("");
  const [titles, setTitles] = useState([""]);
  const [bodyList, setBodyList] = useState([""]);
  const [images, setImages] = useState([""]);
  const [page, setPage] = useState(0);

  const onChange = (e, setItem, item) => {
    /** This functions creates a copy of the array and replaces it */
    const { name, value } = e.target;
    let arrayCopy = item.slice();
    arrayCopy[page] = value;
    setItem(arrayCopy);
  };

  const onSubmit = (e) => {
    /* 
    preventDefault is important because it
    prevents the whole page from reloading
    */
    e.preventDefault();
    if (
      name == "" ||
      titles == null ||
      bodyList == null
      //||
      //images == null
    ) {
      window.alert("Empty field detected. Please fill all fields.");
      return;
    }

    FirestoreService.setPreText(name, {
      id: name,
      titles: titles,
      bodyList: bodyList,
      images: images,
    }).then(
      () => setName(""),
      setTitles([""]),
      setBodyList([""]),
      setImages([""]),
      setPage(0)
    ); //".then" will reset the form to nothing
  };

  const clear = () => {
    setName("");
    setTitles([""]);
    setBodyList([""]);
    setImages([""]);
    setPage(0);
  };

  const pageButtons = bodyList.map((page, i) => (
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
              setTitles([...titles, ""]);
              setBodyList([...bodyList, ""]);
              setImages([...images, ""]);
              setPage(page + 1);
            }}
          >
            +
          </Button>
        </ButtonGroup>
      </ButtonToolbar>

      <form onSubmit={onSubmit}>
        <div className="input-div">
          <div className="inside-input-div">
            <label>Setting Name</label>
            <input
              className="input-settings"
              placeholder="set name"
              value={name}
              name="id"
              onChange={(e) => setName(e.currentTarget.value)}
              type="text"
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
              value={titles[page]}
              name="titles"
              onChange={(e) => onChange(e, setTitles, titles)}
              type="text"
            />
          </div>
          <div>
            <label>Body</label>
            <textarea
              rows="10"
              cols="80"
              className="input-settings"
              placeholder="Split rows using the \n annotation, Here is an example: First Row\nSecond Row\nThird Row"
              value={bodyList[page]}
              name="bodyList"
              onChange={(e) => onChange(e, setBodyList, bodyList)}
              type="text"
            />
          </div>
          <div>
            <label>Image URL</label>
            <textarea
              cols="80"
              rows="1"
              className="input-settings"
              placeholder="for an image, enter a url. For question options, enter: opt1,opt2,opt3"
              value={images[page]}
              name="images"
              onChange={(e) => onChange(e, setImages, images)}
              type="text"
            />
          </div>
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
export default AddPreTextItemForm;
