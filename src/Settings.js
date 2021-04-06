import React, { useState, useEffect } from "react";
import ViewLog from "./components/viewLog";
import ViewPreExperimentData from "./components/viewPreExperimentData.jsx";
import ViewParameters from "./components/viewParameters";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import "./settings.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import * as FirestoreService from "./firebase";

/**
 * Settings Page:
 * To view this page, the user needs to log in.
 * To create a new user, use the firebase authentication console.
 * In this page the user can change the experiment settings -
 * - Parameters: experiment parameters, such as scoring
 * - Pre-Experiment: text+images+questionnaire
 * - Log: view, edit and download the log
 */
function Settings() {
  const [login, setLogin] = useState(false); // holds the log with info about current session
  const [email, setEmail] = useState(""); // holds the log with info about current session
  const [password, setPassword] = useState(""); // holds the log with info about current session

  // This function sets the css body class name
  useEffect(() => {
    document.body.className = "body-settings";
  }, []);

  useEffect(() => {
    FirestoreService.auth.onAuthStateChanged((user) =>
      user ? setLogin(user.email) : setLogin(false)
    );
  }, []);

  const userLogout = () => {
    FirestoreService.userLogout();
  };

  const onSubmit = (e) => {
    /* 
    preventDefault is important because it
    prevents the whole page from reloading
    */
    e.preventDefault();
    if (email == "" || password == "") {
      window.alert("Empty field detected. Please fill all fields.");
      return;
    }
    console.log("sign in: " + email + password);

    FirestoreService.authenticateUser(email, password);
  };

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
            {"   " + process.env.REACT_APP_AUTH_DOMAIN}
            {", Logged as: " + login}
          </Nav.Link>
        </Nav>

        <Button href="/test-1/info-1/1/page-1" variant="outline-info">
          Experiment
        </Button>
        {"_"}
        <Button
          href="https://console.firebase.google.com/u/0/project/driving-simulator-tau-test/firestore/"
          variant="outline-info"
        >
          Firestore TEST
        </Button>
        {"_"}
        <Button
          href="https://console.firebase.google.com/u/0/project/driving-simulator-tau/firestore/"
          variant="outline-info"
        >
          Firestore PROD
        </Button>

        {login ? (
          <Button className="input-settings" onClick={() => userLogout()}>
            {" "}
            Logout{" "}
          </Button>
        ) : (
          <form onSubmit={onSubmit}>
            <input
              className="input-settings"
              placeholder="your@email.com"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.currentTarget.value)}
              type="email"
            />
            <input
              className="input-settings"
              placeholder="Password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.currentTarget.value)}
              type="password"
            />

            <Button type="submit" variant="success" className="input-settings">
              {" "}
              Login{" "}
            </Button>
          </form>
        )}
      </Navbar>

      {/** Tabs (paramerets, pre-experiment, log) */}
      {!login ? (
        <h1 className="div1">Please Log In {login}</h1>
      ) : (
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
      )}
    </>
  );
}

export default Settings;
