import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Experiment from "./Experiment";
import Settings from "./Settings";
const queryString = require("query-string");

export default function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/:id" children={<Experiment />} />
        </Switch>
      </div>
    </Router>
  );
}
