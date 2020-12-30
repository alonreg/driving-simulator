import React, { useState, useEffect } from "react";
import * as FirestoreService from "../firebase";
import AddItemForm from "./additemform";
import ItemList from "./itemList";
import UpdateItem from "./updateitem";

function ViewParameters() {
  const initialItemState = [
    {
      name: null,
      computerError: "",
      humanError: "",
      obstaclesNum: "",
      startWithAuto: "",
      calculation: null,
      pass: "",
      fail: "",
      rescue: "",
      success: "",
    },
  ];

  const [editing, setEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(initialItemState);

  const editItem = (item) => {
    setEditing(true);
    setCurrentItem({
      id: item.id,
      computerError: +item.computerError || item.computerError,
      humanError: +item.humanError || item.humanError,
      obstaclesNum: +item.obstaclesNum || item.obstaclesNum,
      startWithAuto: item.startWithAuto,
      calculation: +item.calculation || item.calculation,
      pass: +item.pass || item.pass,
      fail: +item.fail || item.fail,
      rescue: +item.rescue || item.rescue,
      success: +item.success || item.success,
    });
  };

  const updateItem = ({ currentItem }, updatedItem) => {
    setEditing(false);
    FirestoreService.updateParameters(currentItem.id, updatedItem);
  };

  return (
    <>
      <h1>Edit Parameters - (IN {process.env.REACT_APP_AUTH_DOMAIN})</h1>
      <ItemList editItem={editItem} />

      {editing ? (
        <>
          <h2>Edit Parameters Set</h2>

          <UpdateItem
            setEditing={setEditing}
            currentItem={currentItem}
            updateItem={updateItem}
          />
        </>
      ) : (
        <>
          <h2>Add New Parameter Set</h2>
          <AddItemForm />
        </>
      )}
    </>
  );
}
export default ViewParameters;
