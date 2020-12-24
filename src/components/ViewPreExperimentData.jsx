import React, { useState, useEffect, useRef } from "react";
import * as FirestoreService from "../firebase";
import "../settings.css";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";

function NewlineText(props) {
  const text = props.text;
  const newText = text
    .split("\n")
    .map((str) => <p className="new-line-text">{str}</p>);

  return newText;
}

function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  return (
    <>
      <Button variant="light" ref={target} onClick={() => setShow(!show)}>
        view
      </Button>
      <Overlay target={target.current} show={show} placement="bottom">
        {(props) => (
          <Tooltip id="overlay" {...props}>
            <pre className="info-tooltip">{text}</pre>
          </Tooltip>
        )}
      </Overlay>
    </>
  );
}

const useItems = () => {
  const [items, setItems] = useState([]); //useState() hook, sets initial state to an empty array
  useEffect(() => {
    const unsubscribe = FirestoreService.getInfoData().onSnapshot(
      (snapshot) => {
        //You can "listen" to a document with the onSnapshot() method.
        const listItems = snapshot.docs.map((doc) => ({
          //map each document into snapshot
          id: doc.id, //id and data pushed into items array
          ...doc.data(), //spread operator merges data to id.
        }));
        console.log(listItems);
        setItems(listItems); //items is equal to listItems
      }
    );
    return () => unsubscribe();
  }, []);
  return items;
};

const ViewPreExperimentData = () => {
  function getFormattedTime() {
    var today = new Date();
    var y = today.getFullYear();
    // JavaScript months are 0-based.
    var m = today.getMonth() + 1;
    var d = today.getDate();
    var h = today.getHours();
    var mi = today.getMinutes();
    return y + "-" + m + "-" + d + "--" + h + "-" + mi;
  }

  const itemsFromFirestore = useItems();
  //itemsFromFirestore.sort((a, b) => b.startTime - a.startTime); // sort by date, decending

  const titles = itemsFromFirestore.map((item) => item.titles[0]);
  const body = itemsFromFirestore.map((item) => item.body[0]);
  const images = itemsFromFirestore.map((item) => item.images[0]);

  console.log("hi hi " + typeof titles);
  return (
    <>
      <NewlineText text={titles.toString()} />
      <NewlineText text="aaaa \n aaa" />
      <NewlineText text={images.toString()} />
    </>
  );
};
export default ViewPreExperimentData;
