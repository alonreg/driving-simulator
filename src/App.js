import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Experiment from "./Experiment";
import Settings from "./Settings";
import InformationPage from "./informationPage";
const queryString = require("query-string");

export default function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/settings" children={<Settings />} />
          {/** ID = parameters id, urlInfoDataId = pre-experiment params */}
          <Route path="/:id/:urlInfoDataId/2" children={<Experiment />} />
          {/** ID = parameters id, urlInfoDataId = pre-experiment params, page-:urlPageNumber = page number in pre-experiment*/}
          <Route
            path="/:id/:urlInfoDataId/1/page-:urlPageNumber"
            children={<InformationPage />}
          />
        </Switch>
      </div>
    </Router>
  );
}
