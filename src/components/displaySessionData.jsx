import React, { useState, useEffect } from "react";
import * as FirestoreService from "../firebase";
import "../settings.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const useItems = () => {
  const [items, setItems] = useState([]); //useState() hook, sets initial state to an empty array
  useEffect(() => {
    const unsubscribe = FirestoreService.getSessionData().onSnapshot(
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

const ItemList = ({ editItem }) => {
  const mapToTable = function (item, i) {
    if (item.id == "global") return;

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
  const listItem = useItems();

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
            <th>Options</th>
          </tr>
        </thead>
        <tbody id="content">{listItems}</tbody>
      </Table>
    </>
  );
};
export default ItemList;
