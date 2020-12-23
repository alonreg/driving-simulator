import React, { useState, useEffect } from "react";
import * as FirestoreService from "./firebase";
import AddItemForm from "./components/additemform";
import ItemList from "./components/itemList";
import ViewLog from "./components/viewLog";
import UpdateItem from "./components/updateitem";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
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

  // This function sets the css body class name
  useEffect(() => {
    document.body.className = "body-settings";
  }, []);

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
      <Tabs defaultActiveKey="log" id="uncontrolled-tab">
        <Tab eventKey="parameters" title="Parameters">
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
        </Tab>
        <Tab eventKey="pretext" title="Pre-Experiment">
          <h1>Edit Pre-Experiment Text and Images</h1>
          <AddItemForm />
        </Tab>
        <Tab eventKey="log" title="Log">
          <h1>View Experiment Log</h1>
          <ViewLog />
        </Tab>
      </Tabs>
    </div>
  );
}

export default Settings;
