import React, { useState, useEffect } from "react";
import * as FirestoreService from "./firebase";
import AddItemForm from "./components/additemform";
import ItemList from "./components/itemList";
import UpdateItem from "./components/updateitem";
import "./settings.css";

function Settings() {
  const initialItemState = [
    {
      name: null,
      computerError: "",
      humanError: "",
      obstaclesNum: "",
      startWithAuto: "",
      calculation: null, //null
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
    <div className="div1">
      <h1>Settings</h1>
      <ItemList editItem={editItem} />

      {editing ? (
        <>
          <h2>Edit Item</h2>

          <UpdateItem
            setEditing={setEditing}
            currentItem={currentItem}
            updateItem={updateItem}
          />
        </>
      ) : (
        <>
          <h2>Add Item</h2>
          <AddItemForm />
        </>
      )}
    </div>
  );
}

export default Settings;
