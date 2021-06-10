import React, { useState, useEffect } from "react";
import * as FirestoreService from "../firebase";

const UseInitialData = (name) => {
  const [paramArray, setParamArray] = useState(null); // array for randomly choosing a parameter set
  // pull the chosen information regarding chosen data sets from the database
  useEffect(() => {
    if (!paramArray) {
      const unsubscribe =
        FirestoreService.getInitialDataSetsSnapshot().onSnapshot(
          (docSnapshot) => {
            const data = docSnapshot.data();
            if (!data) {
              FirestoreService.createInitialDataSets();
            }
            setParamArray(data[name]);
          }
        );

      return () => unsubscribe();
    }
  }, []);
  return paramArray;
};
export default UseInitialData;
