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
import downloadIcon from "../assets/download.png";

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
);

const useItems = () => {
  const [items, setItems] = useState([]); //useState() hook, sets initial state to an empty array
  useEffect(() => {
    const unsubscribe = FirestoreService.getAllSessions().onSnapshot(
      (snapshot) => {
        const listItems = snapshot.docs.map((doc) => {
          const arr = Object.keys(doc.data()).map((i) => Number(i));
          const min = Math.min(...arr);
          const totalSessions = arr.length;
          //map each document into snapshot
          return {
            id: doc.id, //id and data pushed into items array
            totalSessions: totalSessions,
            ...doc.data()[min],
          }; //spread operator merges data to id.
        });
        setItems(listItems); //items is equal to listItems
      }
    );
    return () => unsubscribe();
  }, []);
  return items;
};

const ViewLog = () => {
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
        <td>{item.totalSessions}</td>
        {item.questions ? (
          <td>
            <InfoTooltip text={JSON.stringify(item.questions, null, 2)} />
          </td>
        ) : (
          <td>empty</td>
        )}
        {item.answers ? (
          <td>
            <InfoTooltip text={JSON.stringify(item.answers, null, 2)} />
          </td>
        ) : (
          <td>empty</td>
        )}
        <td>
          <InfoTooltip text={JSON.stringify(item.parameters, null, 2)} />
        </td>

        {item.log != "empty" && item.log != undefined ? (
          <td className="table-center">
            <InfoTooltip
              text={item.log.map(
                (action) => JSON.stringify(action.action) + ",\n"
              )}
            />

            <CSVLink
              data={item.log}
              filename={"log-" + item.id + getFormattedTime() + ".csv"}
            >
              <img className="download-button" src={downloadIcon} />
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
  const itemsFromFirestoreClone = JSON.parse(
    JSON.stringify(itemsFromFirestore)
  );
  let itemsForExport = [];
  if (itemsFromFirestore[0]) {
    itemsForExport = itemsFromFirestoreClone.map((element) => {
      if (element.log) delete element.log;
      if (element.parameters) {
        Object.keys(element.parameters).map((param) => {
          console.log("param" + element.parameters[param]);
          element["param_" + param] = element.parameters[param];
          if (param == "startWithAuto") {
            element["param_" + param] = element.parameters[param]
              ? "auto"
              : "man";
          }
        });
        delete element.parameters;
      }
      if (element.obstacles) {
        Object.keys(element.obstacles).map((param) => {
          console.log("param" + element.obstacles[param]);
          element["obstaclesSum_" + param] = element.obstacles[param];
        });
        delete element.obstacles;
      }
      delete element.timeOnAuto;
      if (element.endTime == 0) {
        element.totalTime = "undone";
      } else {
        element.totalTime = element.endTime - element.startTime;
      }
      return element;
    });
  }
  /*
  Object.keys(itemsFromFirestore["parameters"]).forEach(
    (key) => (itemsForExport[key] = itemsFromFirestore["parameters"][key])
  );*/

  itemsFromFirestore.sort((a, b) => b.startTime - a.startTime); // sort by date, decending

  const listItems = itemsFromFirestore.map(mapToTable);
  // headers for CSV output
  const headers = [
    { label: "session ID", key: "id" },
    { label: "param set", key: "parametersSet" },
    { label: "start at", key: "startTime" },
    { label: "end time", key: "endTime" },
    { label: "final score", key: "score" },
    { label: "total time", key: "totalTime" },
    { label: "begin with mode", key: "param_startWithAuto" },
    { label: "wait-decision", key: "param_timeoutComputerDecision" },
    { label: "wait between - min", key: "param_timeoutNextObstacleFloor" },
    { label: "wait between - max", key: "param_timeoutNextObstacleMax" },
    { label: "k value", key: "param_kValue" },
    { label: "random - min", key: "param_randomValues" },
    //////
    { label: "score - success", key: "param_success" },
    { label: "score - calculation", key: "param_calculation" },
    { label: "score - rescue", key: "param_rescue" },
    { label: "score - pass", key: "param_pass" },
    { label: "score - fail", key: "param_fail" },
    /////
    { label: "total obstacles", key: "param_obstaclesNum" },
    { label: "human error", key: "param_humanError" },
    { label: "computer error", key: "param_computerError" },
    { label: "mode changes", key: "modeChanges" },
    { label: "total comp fail", key: "obstaclesSum_failByComp" },
    { label: "total comp success", key: "obstaclesSum_successByComp" },
    { label: "total human fail", key: "obstaclesSum_failByHuman" },
    { label: "total human success", key: "obstaclesSum_successByHuman" },
    { label: "total rescue calls", key: "obstaclesSum_rescueCount" },
    { label: "total calc fail", key: "obstaclesSum_calcFail" },
    { label: "total correct calc", key: "obstaclesSum_calcSuccess" },
    { label: "no. of sessions", key: "totalSessions" },
    { label: "questions", key: "questions" },
    { label: "answers", key: "answers" },
  ];

  console.log(itemsFromFirestore);
  return (
    <>
      <Table size="sm" striped bordered hover>
        <thead>
          <tr>
            {[
              "Id",
              "Params",
              "Start (UTC)",
              "End (UTC)",
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
              "Total sessions",
              "Questions",
              "Answers",
              "Parameters",
              "Log",
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
        headers={headers}
        filename={"sim-export-" + getFormattedTime() + ".csv"}
      >
        <Button
          onClick={() => console.log(itemsForExport)}
          variant="outline-primary"
        >
          Export to CSV
        </Button>
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
