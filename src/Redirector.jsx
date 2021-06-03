import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Loader from "react-loader-spinner";
import * as FirestoreService from "./firebase";

/** Redirects the user to 1 out of 4 options for the experiment, randomly.
 * Currently the 4 options are:[1173745299, 3528014733, 7230534658, 8455407314]
 * They can be viewed at the Settings page or Firebase Database.
 */
const Redirector = () => {
  let history = useHistory();
  const queryString = require("query-string");
  const parsed = queryString.parse(window.location.search);
  const [paramArray, setParamArray] = useState(null); // array for randomly choosing a parameter set
  const [preExperiment, setPreExperiment] = useState(null); // string for pre experiment set
  const [questions, setQuestions] = useState(null); // string for pre experiment set

  // Returns a random option from an array
  const getRandomFromArray = (list) =>
    list[Math.floor(Math.random() * list.length)];

  // pull the chosen information regarding chosen data sets from the database
  useEffect(() => {
    if (!paramArray) {
      FirestoreService.getInitialDataSets().then((doc) => {
        const data = doc.data();
        setParamArray(data.paramArray);
        setPreExperiment(data.preExperiment);
        setQuestions(data.questions);
      });
    }
  }, []);

  // redirect whenever the data is ready
  useEffect(() => {
    if (paramArray && preExperiment && questions) {
      // The experiment parameters id
      let id = getRandomFromArray(paramArray); //[1173745299, 3528014733, 7230534658, 8455407314]
      // The pre-experiment data id
      //let infoData = getRandomFromArray(preExperimentArray); //[3217492]
      // The questionare id
      //let questionsData = getRandomFromArray(); //[5079130]

      // Push the newely created URL
      console.log("in use effect param");
      history.push({
        pathname: `/${id}/${preExperiment}/${questions}/1/page-1`, // the path to the pre-experiment part
        search: "?aid=" + parsed.aid,
        aid: parsed.aid,
      });
    }
    console.log("outsiede effect param");
  }, [paramArray, preExperiment, questions]);

  // load as long as there's no info
  return (
    <>
      <div className="center-spinner">
        <Loader type="ThreeDots" color="#00BFFF" height={100} width={100} />
      </div>
    </>
  );
};

export default Redirector;
