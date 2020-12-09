import React, { useState, useEffect, useRef } from "react";
import * as FirestoreService from "../firebase";
import "../settings.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { CSVLink, CSVDownload } from "react-csv";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import PopoverContent from "react-bootstrap/PopoverContent";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

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

const renderTooltip = (props, text) => (
  <Tooltip id="button-tooltip">aaa</Tooltip>

  /*
  <Overlay
  target={pointsTarget.current}
  show={showPoints}
  placement="bottom"
>
  {(props) => (
    <Tooltip id="overlay-example" {...props}>
      {JSON.stringify(item.parameters.calculation)}
    </Tooltip>
  )}
</Overlay>*/
);

const useItems = () => {
  const [items, setItems] = useState([]); //useState() hook, sets initial state to an empty array
  useEffect(() => {
    const unsubscribe = FirestoreService.getAllSessions().onSnapshot(
      (snapshot) => {
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

const ViewLog = ({ editItem }) => {
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

  const mapToTable = function (item, i) {
    const start = new Date(item.startTime).toISOString();
    let end = item.endTime;
    if (item.endTime != 0) {
      console.log(item.endTime);
      console.log(item.endTime);
      console.log(item.endTime);
      console.log(item.endTime);
      end = new Date(item.endTime).toISOString();
    } else {
      console.log(item.endTime);
    }
    return (
      <tr key={i} className={`font-italic`}>
        <td>{item.id}</td>
        <td>{item.parametersSet}</td>
        <td>{start}</td>
        <td>{end}</td>
        <td>
          {item.endTime - item.startTime < 0
            ? "undone"
            : (item.endTime - item.startTime) / 1000 + "sec"}
        </td>
        <td>{item.score}</td>
        <td>{item.modeChanges}</td>
        <td>{item.obstacles.successByHuman}</td>
        <td>{item.obstacles.successByComp}</td>
        <td>{item.obstacles.failByHuman}</td>
        <td>{item.obstacles.failByComp}</td>
        <td>{item.obstacles.rescueCount}</td>
        <td>{item.obstacles.calcSuccess}</td>
        <td>{item.obstacles.calcFail}</td>
        {item.pollData ? (
          <td>{item.pollData.map((answer) => answer + ", ")}</td>
        ) : (
          <td>empty</td>
        )}
        <td>
          <InfoTooltip text={JSON.stringify(item.parameters, null, 2)} />
        </td>
        {item.log != "empty" && item.log != undefined ? (
          <td>
            <InfoTooltip
              text={item.log.map(
                (action) => JSON.stringify(action.action) + ",\n"
              )}
            />

            <CSVLink
              data={item.log}
              filename={"sim-export-" + getFormattedTime() + ".csv"}
            >
              <p>download</p>
            </CSVLink>
          </td>
        ) : (
          <td>empty</td>
        )}
        <Button
          variant="danger"
          onClick={() => FirestoreService.deleteSession(item.id)}
          className="input-settings"
        >
          Delete
        </Button>
      </tr>
    );
  };

  const itemsFromFirestore = useItems();
  let itemsForExport = itemsFromFirestore;
  delete itemsForExport["log"];
  console.log("alon2" + itemsForExport.log);
  /*
  Object.keys(itemsFromFirestore["parameters"]).forEach(
    (key) => (itemsForExport[key] = itemsFromFirestore["parameters"][key])
  );*/

  const listItems = itemsFromFirestore.map(mapToTable);
  //const csvData =

  console.log(itemsFromFirestore);
  return (
    <>
      <Table size="sm" striped bordered hover>
        <thead>
          <tr>
            {[
              "Id",
              "Params",
              "Start",
              "End",
              "Tot. Time",
              "Score",
              "Mode Change",
              "Success(h)",
              "Success(c)",
              "Fail(h)",
              "Fail(c)",
              "Rescue(h)",
              "Calc Success(h)",
              "Calc Fail(h)",
              "Quest.",
              "points",
              "log",
              "",
            ].map((title) =>
              title.includes("Fail") ? (
                <th className="danger">{title}</th>
              ) : title.includes("Success") ? (
                <th className="success">{title}</th>
              ) : (
                <th>{title}</th>
              )
            )}
          </tr>
        </thead>
        <tbody id="content">{listItems}</tbody>
      </Table>

      <CSVLink
        data={itemsForExport}
        filename={"sim-export-" + getFormattedTime() + ".csv"}
      >
        <Button variant="outline-primary">Export to CSV</Button>
      </CSVLink>
    </>
  );
};
export default ViewLog;

/*


<OverlayTrigger
placement="bottom"
overlay={<Tooltip id="button-tooltip-2">Check out this avatar</Tooltip>}
>
{({ ref, ...triggerHandler }) => (
  <Button
    variant="light"
    {...triggerHandler}
    className="d-inline-flex align-items-center"
  >
    <Image
      ref={ref}
      roundedCircle
      src="holder.js/20x20?text=J&bg=28a745&fg=FFF"
    />
    <span className="ml-1">Hover to see</span>
  </Button>
)}
</OverlayTrigger>,*/
