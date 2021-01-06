import React, { useState, useEffect } from "react";
import * as FirestoreService from "./firebase";
import AddItemForm from "./components/additemform";
import ItemList from "./components/itemList";
import ViewLog from "./components/viewLog";
import ViewParameters from "./components/viewParameters";
import ViewPreExperimentData from "./components/viewPreExperimentData";
import UpdateItem from "./components/updateitem";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import "./settings.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
//import Form from "react-bootstrap/Form";
//import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function Settings() {
  // This function sets the css body class name
  useEffect(() => {
    document.body.className = "body-settings";
  }, []);

  return (
    <>
      <Navbar bg="dark" variant="dark">
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
      {/*<Router>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#parameters">Driving Simulator</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/settings/parameters">Parameters</Nav.Link>
            <Nav.Link href="/settings/pretext">Pre-Experiment</Nav.Link>
            <Nav.Link href="/settings/log">Log</Nav.Link>
          </Nav>
          <Button href="/test-1/1/page-1" variant="outline-info">
            Go to experiment
          </Button>
        </Navbar>

        <Switch>
          <Route exact path="/settings/">
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
          </Route>
          <Route path="/settings/parameters">
            <h1>Edit Pre-Experiment Text and Images</h1>
            <ViewPreExperimentData />
          </Route>
          <Route path="/settings/log">
            <h1>View Experiment Log</h1>
            <ViewLog />
          </Route>
        </Switch>
            </Router>  */}

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
