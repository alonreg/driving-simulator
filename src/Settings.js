import React, { useState, useEffect } from "react";
import ViewLog from "./components/viewLog";
import ViewParameters from "./components/viewParameters";
import ViewPreExperimentData from "./components/viewPreExperimentData";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import "./settings.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

/**
 * Settings Page:
 * In this page the user can change the experiment settings -
 * - Parameters: experiment parameters, such as scoring
 * - Pre-Experiment: text+images+questionnaire
 * - Log: view, edit and download the log
 */
function Settings() {
  // This function sets the css body class name
  useEffect(() => {
    document.body.className = "body-settings";
  }, []);

  return (
    <>
      {/** Navbar at the top of the settings */}
      <Navbar bg="dark" variant="dark" sticky="top">
        <Navbar.Brand>Driving Simulator</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link disabled={true}>
            Domain:
            {process.env.REACT_APP_AUTH_DOMAIN ==
            "driving-simulator-tau-test.firebaseapp.com"
              ? " TEST"
              : " PROD"}
          </Nav.Link>
        </Nav>
        <Button href="/test-1/info-1/1/page-1" variant="outline-info">
          Go to experiment
        </Button>
        {"_"}
        <Button
          href="https://console.firebase.google.com/u/0/project/driving-simulator-tau-test/firestore/"
          variant="outline-info"
        >
          Go to Firestore TEST
        </Button>
        {"_"}
        <Button
          href="https://console.firebase.google.com/u/0/project/driving-simulator-tau/firestore/"
          variant="outline-info"
        >
          Go to Firestore PROD
        </Button>
      </Navbar>

      {/** Tabs (paramerets, pre-experiment, log) */}
      <div className="div1">
        <Tabs defaultActiveKey="pretext" id="uncontrolled-tab">
          <Tab eventKey="parameters" title="Parameters">
            <ViewParameters />
          </Tab>
          <Tab eventKey="pretext" title="Pre-Experiment">
            <h1>Edit Pre-Experiment Text and Images</h1>
            <ViewPreExperimentData />
          </Tab>
          <Tab eventKey="log" title="Log">
            <h1>View Experiment Log</h1>
            <ViewLog />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

export default Settings;
