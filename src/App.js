import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Experiment from "./Experiment";
import Settings from "./Settings";
import Redirector from "./Redirector.jsx";
import InformationPage from "./informationPage";
import Questions from "./questions";
//const queryString = require("query-string");

export default function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/settings" children={<Settings />} />
          {/** ID = parameters id, urlInfoDataId = pre-experiment params */}
          <Route
            path="/:id/:urlInfoDataId/:questionDataId/3"
            children={<Experiment />}
          />
          {/** ID = parameters id, urlInfoDataId = pre-experiment params, page-:urlPageNumber = page number in pre-experiment*/}
          <Route
            path="/:id/:urlInfoDataId/:questionDataId/1/page-:urlPageNumber"
            children={<InformationPage />}
          />
          {/** ID = parameters id, urlInfoDataId = pre-experiment params, page-:urlPageNumber = page number in pre-experiment*/}
          <Route
            path="/:id/:urlInfoDataId/:questionDataId/2/page-:urlPageNumber"
            children={<Questions />}
          />
          {/** Root URL - goes to 1 of 4 sets (the original experiment sets) */}
          <Route path="/" children={<Redirector />} />
        </Switch>
      </div>
    </Router>
  );
}
