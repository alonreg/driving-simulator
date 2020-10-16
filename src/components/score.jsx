import React, { useState } from "react";
import { PassThrough } from "stream";
import { db } from "../firebase";
import useCustomForm from "../hooks/useCustomForm.jsx";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import createSpacing from "@material-ui/core/styles/createSpacing";

function Score({ score, scoreBoard, onChange }) {
  const data = [
    { actionName: "Succesful Pass", score: scoreBoard.success },
    { actionName: "Passing", score: scoreBoard.pass },
    { actionName: "Getting Stuck", score: scoreBoard.fail },
    { actionName: "Calling For Rescue", score: scoreBoard.rescue },
    { actionName: "Correct Calculation", score: scoreBoard.calculation },
  ];

  const mapToTable = function (action, i) {
    var fontColor = action.score > 0 ? "font-green" : "font-red";
    var positiveCharacter = action.score > 0 ? "+" : "";
    return (
      <tr key={i} className={`font-italic score-board  ${fontColor}`}>
        <td>{action["actionName"]}</td>
        <td>{positiveCharacter + action["score"]}</td>
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
        value={score}
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
