import React, { useState, useEffect } from "react";
import * as FirestoreService from "../firebase";
import "../settings.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Switch from "react-switch";

/** The useItems component downloads all session data and renders it into a list */
const useItems = () => {
  const [items, setItems] = useState([]); //useState() hook, sets initial state to an empty array
  useEffect(() => {
    const unsubscribe = FirestoreService.getAllParametersData().onSnapshot(
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

const useInitialData = () => {
  const [paramArray, setParamArray] = useState(null); // array for randomly choosing a parameter set
  // pull the chosen information regarding chosen data sets from the database
  useEffect(() => {
    if (!paramArray) {
      const unsubscribe =
        FirestoreService.getInitialDataSetsSnapshot().onSnapshot(
          (docSnapshot) => {
            const data = docSnapshot.data();
            setParamArray(data.paramArray);
          }
        );
      return () => unsubscribe();
    }
  }, []);
  return paramArray;
};

const ItemList = ({ editItem }) => {
  const paramArray = useInitialData();

  const mapToTable = function (item, i) {
    return (
      <tr key={i} className={`font-italic`}>
        <td>{item.id}</td>
        <td>{item.computerError}</td>
        <td>{item.humanError}</td>
        <td>{item.obstaclesNum}</td>
        <td>{item.startWithAuto == true ? "true" : "false"}</td>
        <td>{item.calculation}</td>
        <td>{item.pass}</td>
        <td>{item.fail}</td>
        <td>{item.rescue}</td>
        <td>{item.success}</td>
        <td>{item.timeoutComputerDecision}</td>
        <td>{item.timeoutNextObstacleFloor}</td>
        <td>{item.timeoutNextObstacleMax}</td>
        <td>{item.kValue + ", [" + item.randomValues + "]"}</td>
        <td>
          {paramArray ? (
            <Switch
              onChange={() => {
                if (paramArray.includes(item.id)) {
                  const newArray = paramArray.filter((id) => id != item.id);
                  FirestoreService.setInitialDataSets("paramArray", newArray);
                } else {
                  FirestoreService.setInitialDataSets("paramArray", [
                    ...paramArray,
                    item.id,
                  ]);
                }
              }}
              checked={paramArray.includes(item.id)}
            />
          ) : (
            <></>
          )}
        </td>
        <Button onClick={() => editItem(item)} className="input-settings">
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => FirestoreService.deleteParameters(item.id)}
          className="input-settings"
        >
          Delete
        </Button>
      </tr>
    );
  };

  const listItems = useItems().map(mapToTable);
  //const listItem = useItems();

  return (
    <>
      <Table className="font-small" striped bordered hover>
        <thead>
          <tr>
            <th>Setting Name</th>
            <th>Vehicle Error</th>
            <th>Human Error</th>
            <th>Num. of Obst.</th>
            <th>Auto Mode First?</th>
            <th>Calculation</th>
            <th>Pass</th>
            <th>Fail</th>
            <th>Rescue</th>
            <th>Success</th>
            <th>Decision (ms)</th>
            <th>Wait max (ms)</th>
            <th>Wait min (ms)</th>
            <th>k value, randoms</th>
            <th>Include</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody id="content">{listItems}</tbody>
      </Table>
    </>
  );
};
export default ItemList;
