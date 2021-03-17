import React, { useState, useEffect, useRef } from "react";
import * as FirestoreService from "../firebase";
import "../settings.css";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import UpdatePreTextItem from "./updatePreTextItem.jsx";
import AddPreTextItemForm from "./addPreTextItemForm.jsx";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

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
  const initialItemState = {
    id: "",
    titles: [],
    bodyList: [],
    images: [],
  };
  const [currentItem, setCurrentItem] = useState(initialItemState);

  const selectItem = (item) => {
    setCurrentItem({
      id: item.id,
      titles: item.titles,
      bodyList: item.bodyList,
      images: item.images,
    });
  };

  const updateItem = ({ currentItem }, updatedItem) => {
    FirestoreService.updatePreText(currentItem.id, updatedItem);
  };

  const itemsFromFirestore = useItems();
  //itemsFromFirestore.sort((a, b) => b.startTime - a.startTime); // sort by date, decending

  const titles = itemsFromFirestore.map((item) => item.titles[0]);
  const body = itemsFromFirestore.map((item) => item.bodyList[0].toString());
  const bodyList = itemsFromFirestore.map((item) => item.bodyList);
  const images = itemsFromFirestore.map((item) => item.images[0]);

  if (!bodyList[0]) {
    return (
      <>
        <div className="preTextGrid">
          <div className="div1-preText">
            <h3>Add new sets of information</h3>

            <AddPreTextItemForm />
          </div>
        </div>
      </>
    );
  }

  const setsId = itemsFromFirestore.map((item) => {
    return (
      <Dropdown.Item
        onSelect={(eventKey, event) => selectItem(item)}
        eventKey={item.id}
      >
        {item.id}
      </Dropdown.Item>
    );
  });

  return (
    <>
      <div className="preTextGrid">
        <div className="div1-preText">
          <h3>Add new sets of information</h3>

          <AddPreTextItemForm />
        </div>
        <div className="div3-preText"></div>
        <div className="div2-preText">
          <h3>Update sets of information</h3>
          <DropdownButton
            title={currentItem.id || "Choose Set"}
            id="bg-nested-dropdown"
          >
            {setsId}
          </DropdownButton>

          <UpdatePreTextItem
            currentItem={currentItem}
            updateItem={updateItem}
            setCurrentItem={(item) => setCurrentItem(item)}
          />
        </div>
      </div>

      {/*<NewlineText text={bodyList[0][0]} />
      <NewlineText text={images.toString()} />*/}
    </>
  );
};
export default ViewPreExperimentData;
