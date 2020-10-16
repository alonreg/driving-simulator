import shadows from "@material-ui/core/styles/shadows";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCB5wrgUcWJgSm0wpAUmsTPNPK57SJ0nCs",
  authDomain: "driving-simulator-tau.firebaseapp.com",
  databaseURL: "https://driving-simulator-tau.firebaseio.com",
  projectId: "driving-simulator-tau",
  storageBucket: "driving-simulator-tau.appspot.com",
  messagingSenderId: "860406815816",
  appId: "1:860406815816:web:7fd648668de95525834c7d",
  measurementId: "G-6Z7JZMHK27",
};

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
  score,
  scoreBoard,
  totalTime,
  timeOnAuto,
  modeChanges,
}) => {
  console.log("firebase > setSesstionData > " + session);
  db.collection("sessions")
    .doc(session)
    .set(
      {
        obstacles: {
          successByHuman: successByHuman ?? 0,
          successByComp: successByComp ?? 0,
          failByHuman: failByHuman ?? 0,
          failByComp: failByComp ?? 0,
        },
        score: score ?? 0,
        totalTime: totalTime ?? 0,
        timeOnAuto: timeOnAuto ?? 0,
        modeChanges: modeChanges ?? 0,
        scoreBoard: scoreBoard ?? "",
      },
      { merge: true }
    )
    .then((ref) => {
      console.log("ref of setSessionData in fIREBASE.JS: " + ref);
    }); //catch error  - .catch()
};
