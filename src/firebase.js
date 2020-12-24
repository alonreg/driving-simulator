import shadows from "@material-ui/core/styles/shadows";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

//let firebaseConfig = require("./env.json");

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

/**
if (Object.keys(functions.config()).length){
  firebaseConfig = functions.config().
}
 */

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

export const authenticateAnonymously = () => {
  console.log("firebase > authenticate Anonymously");
  return firebase.auth().signInAnonymously();
};

export const getInfoData = () => {
  return db.collection("preExperiment"); //.orderBy("startTime");
};

export const createSession = ({
  session,
  startTime,
  parameters,
  global,
  parametersSet,
  pollData,
} = {}) => {
  const data = {
    obstacles: {
      successByHuman: 0,
      successByComp: 0,
      failByHuman: 0,
      failByComp: 0,
      rescueCount: 0,
      calcSuccess: 0,
      calcFail: 0,
    },
    startTime: startTime,
    endTime: 0,
    totalTime: 0,
    score: 0,
    totalTime: 0,
    timeOnAuto: 0,
    modeChanges: 0,
    log: "empty",
    serverTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    parametersSet: parametersSet,
    parameters: parameters,
    global: global,
    pollData: pollData ?? [],
  };

  db.collection("sessions")
    .doc(session) // sessionID
    .set({ [startTime]: data }, { merge: true })
    .then((ref) => {
      console.log("ref of create session in FIREBASE.JS: " + ref + session);
      return "sessions";
    });
};

export const getParametersData = (parameterSet) => {
  return db.collection("parameters").doc(parameterSet).get();
};

export const getAllParametersData = () => {
  return db.collection("parameters");
};

export const getAllSessions = () => {
  return db.collection("sessions"); //.orderBy("startTime");
};

export const getSessionData = (sessionId) => {
  return db.collection("sessions").doc(sessionId).get();
};

export const setSessionData = ({
  session,
  successByHuman,
  successByComp,
  failByHuman,
  failByComp,
  rescueCount,
  calcSuccess,
  calcFail,
  score,
  scoreBoard,
  startTime,
  endTime,
  totalTime,
  timeOnAuto,
  modeChanges,
  pollData,
  parameters,
  global,
  log,
  parametersSet,
} = {}) => {
  console.log("firebase > setSesstionData > " + session);
  console.log("firebase > setSesstionData2 > " + pollData);

  const data = {
    obstacles: {
      successByHuman: successByHuman ?? 0,
      successByComp: successByComp ?? 0,
      failByHuman: failByHuman ?? 0,
      failByComp: failByComp ?? 0,
      rescueCount: rescueCount ?? 0,
      calcSuccess: calcSuccess ?? 0,
      calcFail: calcFail ?? 0,
    },
    endTime: endTime ?? 0,
    totalTime: totalTime ?? 0,
    score: score ?? 0,
    totalTime: totalTime ?? 0,
    timeOnAuto: timeOnAuto ?? 0,
    modeChanges: modeChanges ?? 0,
    log: log ?? "empty",
    serverTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };

  console.log("firebase > setSessionData data: > " + parametersSet);

  db.collection("sessions")
    .doc(session) // sessionID
    .set({ [startTime]: data }, { merge: true })
    .then((ref) => {
      console.log("ref of setSessionData in FIREBASE.JS: " + ref + session);
    }); //catch error  - .catch()
};

export const setParameters = ({
  set,
  computerError,
  humanError,
  obstaclesNum,
  startWithAuto,
  calculation,
  fail,
  pass,
  rescue,
  success,
}) => {
  return db
    .collection("parameters")
    .doc(set)
    .set(
      {
        computerError: computerError,
        humanError: humanError,
        obstaclesNum: obstaclesNum,
        startWithAuto: startWithAuto,
        success: success ?? 100,
        pass: pass ?? 0,
        rescue: rescue ?? 0,
        fail: fail ?? 0,
        calculation: calculation ?? 0,
      },
      { merge: true }
    );
};

export const deleteParameters = (set) => {
  db.collection("parameters").doc(set).delete();
};
//export const setParameters = {};
export const deleteSession = (session) => {
  db.collection("sessions")
    .doc(session) // user id
    .delete();
};

export const updateParameters = (set, updatedItem) => {
  delete updatedItem.id;
  db.collection("parameters").doc(set).update(updatedItem);
};
