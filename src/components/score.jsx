import React, { useState } from "react";
import { PassThrough } from "stream";
import { db } from "../firebase";
import useCustomForm from "../hooks/useCustomForm.jsx";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import createSpacing from "@material-ui/core/styles/createSpacing";

function Score(props) {
  const data = [
    { actionName: "Succesful Pass", score: "+150" },
    { actionName: "Passing", score: "-50" },
    { actionName: "Getting Stuck", score: "-150" },
    { actionName: "Calling For Rescue", score: "-10" },
    { actionName: "Correct Calculation", score: "+20" },
  ];

  const mapToTable = function (action, i) {
    var fontColor = action.score > 0 ? "font-green" : "font-red";
    return (
      <tr key={i} className={`font-italic score-board  ${fontColor}`}>
        <td>{action["actionName"]}</td>
        <td>{action["score"]}</td>
      </tr>
    );
  };
  const listItems = data.map(mapToTable);

  return (
    <>
      <h3 className="font-small">Your Score</h3>
      <input
        className="inputRounded score"
        name="score"
        type="text"
        value={props.score}
        readOnly
      />
      <div></div>
      <div>
        <Table className="font-small" striped bordered hover>
          <tbody id="content">{listItems}</tbody>
        </Table>
      </div>
    </>
  );
}

export default Score;
