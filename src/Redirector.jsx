import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Loader from "react-loader-spinner";

/** Redirects the user to 1 out of 4 options for the experiment, randomly.
 * Currently the 4 options are:[1173745299, 3528014733, 7230534658, 8455407314]
 * They can be viewed at the Settings page or Firebase Database.
 */
const Redirector = () => {
  let history = useHistory();

  // Returns a random option from an array
  const getRandomFromArray = (list) =>
    list[Math.floor(Math.random() * list.length)];

  // The experiment parameters id
  let id = getRandomFromArray([1173745299, 3528014733, 7230534658, 8455407314]);
  // The pre-experiment data id
  let infoData = getRandomFromArray([3217492]);
  // Push the newely created URL
  history.push(`/${id}/${infoData}/1/page-1`);

  return <></>;
};

export default Redirector;
