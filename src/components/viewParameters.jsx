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
      timeoutComputerDecision: "",
      timeoutNextObstacleFloor: "",
      timeoutNextObstacleMax: "",
      kValues: "",
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
      timeoutComputerDecision:
        +item.timeoutComputerDecision || item.timeoutComputerDecision,
      timeoutNextObstacleFloor:
        +item.timeoutNextObstacleFloor || item.timeoutNextObstacleFloor,
      timeoutNextObstacleMax:
        +item.timeoutNextObstacleMax || item.timeoutNextObstacleMax,
      kValue: +item.kValue || item.kValue,
      randomValues: [-2.5, 2.5], // if needed, can be changed to dynamic changable values
    });
  };

  const updateItem = ({ currentItem }, updatedItem) => {
    setEditing(false);
    FirestoreService.updateParameters(currentItem.id, updatedItem);
  };

  return (
    <>
      <h1>Experiment Parameters</h1>
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
