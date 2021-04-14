import React, { useState, useEffect, useRef } from "react";
import * as FirestoreService from "../firebase";
import "../settings.css";
import UpdateQuestionsItem from "./updateQuestionsItem.jsx";
import AddQuestionsForm from "./addQuestionsForm.jsx";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const useItems = () => {
  const [items, setItems] = useState([]); //useState() hook, sets initial state to an empty array
  useEffect(() => {
    const unsubscribe = FirestoreService.getQuestionsData().onSnapshot(
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

const ViewQuestions = () => {
  const initialItemState = {
    id: "",
    titles: [],
    answers: [],
    types: [],
  };

  const [currentItem, setCurrentItem] = useState(initialItemState);

  const selectItem = (item) => {
    setCurrentItem({
      id: item.id,
      titles: item.titles,
      answers: item.answers,
      types: item.types,
    });
  };

  const updateItem = ({ currentItem }, updatedItem) => {
    FirestoreService.updateItem(currentItem.id, updatedItem, "questions");
  };

  const itemsFromFirestore = useItems();
  const titles = itemsFromFirestore.map((item) => item.titles);
  const answers = itemsFromFirestore.map((item) => item.answers);
  const types = itemsFromFirestore.map((item) => item.types);

  const setsId = itemsFromFirestore.map((item) => {
    return (
      <Dropdown.Item
        key={item.id}
        onSelect={(eventKey, event) => selectItem(item)}
        eventKey={item.id}
      >
        {item.id}
      </Dropdown.Item>
    );
  });

  if (!titles[0]) {
    return (
      <>
        <div className="preTextGrid">
          <div className="div1-preText">
            <h3>Add new sets of information</h3>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="preTextGrid">
        <div className="div1-preText">
          <h3>Add a new set of information</h3>
          <AddQuestionsForm />
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
          {currentItem.id ? (
            <UpdateQuestionsItem
              currentItem={currentItem}
              updateItem={updateItem}
              setCurrentItem={(item) => setCurrentItem(item)}
              deleteItem={() =>
                FirestoreService.deleteQuestions(currentItem.id)
              }
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewQuestions;
