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

export const createSession = (userId) => {
  return db.collection("sessions").add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    userId: userId,
    obstacles: {
      successByHuman: 0,
      successByComp: 0,
      failByHuman: 0,
      failByComp: 0,
      rescueCount: 0,
      calcSuccess: 0,
      calcFail: 0,
    },
    score: 0,
    parameterSet: "?",
    totalTime: 0,
    timeOnAuto: 0,
    modeChanges: 0,
  });
};

export const getParametersData = (parameterSet) => {
  return db.collection("parameters").doc(parameterSet).get();
};

export const getAllParametersData = () => {
  return db.collection("parameters");
};

export const getAllSessions = () => {
  return db.collection("sessions").orderBy("startTime");
};

export const getSessionData = (sessionId) => {
  return db.collection("sessions").doc(sessionId).get();
};

/*export const getGroceryList = (groceryListId) => {
  return db.collection("groceryLists").doc(groceryListId).get();
};*/

/* export const streamGroceryListItems = (groceryListId, observer) => {
  return db
    .collection("groceryLists")
    .doc(groceryListId)
    .collection("items")
    .orderBy("created")
    .onSnapshot(observer);
};*/

/*
export const addUserToGroceryList = (userName, groceryListId, userId) => {
  return db
    .collection("groceryLists")
    .doc(groceryListId)
    .update({
      users: firebase.firestore.FieldValue.arrayUnion({
        userId: userId,
        name: userName,
      }),
    });
};*/

/*
export const addGroceryListItem = (item, groceryListId, userId) => {
  return getGroceryListItems(groceryListId)
    .then((querySnapshot) => querySnapshot.docs)
    .then((groceryListItems) =>
      groceryListItems.find(
        (groceryListItem) =>
          groceryListItem.data().name.toLowerCase() === item.toLowerCase()
      )
    )
    .then((matchingItem) => {
      if (!matchingItem) {
        return db
          .collection("groceryLists")
          .doc(groceryListId)
          .collection("items")
          .add({
            name: item,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: userId,
          });
      }
      throw new Error("duplicate-item-error");
    });
};*/

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
    startTime: startTime ?? 0,
    endTime: endTime ?? 0,
    totalTime: totalTime ?? 0,
    score: score ?? 0,
    totalTime: totalTime ?? 0,
    timeOnAuto: timeOnAuto ?? 0,
    modeChanges: modeChanges ?? 0,
    log: log ?? "empty",
  };

  if (parameters) data["parameters"] = parameters;
  if (global) data["global"] = global;
  if (scoreBoard) data["scoreBoard"] = scoreBoard; //deprected?
  if (startTime) data["startTime"] = startTime;
  if (pollData) data["pollData"] = pollData;
  if (parametersSet) data["parametersSet"] = parametersSet;
  console.log("firebase > setSessionData data: > " + parametersSet);

  db.collection("sessions")
    .doc(session)
    .set(data, { merge: true })
    .then((ref) => {
      console.log("ref of setSessionData in fIREBASE.JS: " + ref + session);
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
  db.collection("sessions").doc(session).delete();
};

export const updateParameters = (set, updatedItem) => {
  delete updatedItem.id;
  db.collection("parameters").doc(set).update(updatedItem);
};
