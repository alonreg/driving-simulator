import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

/**
 * Firebase Configuration:
 * The configuration is taken from the firebase console.
 * Values are kept in "env.dev" and "end.production" files.
 * The system chooses the correct configration according to the domain being used.
 */
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

// initialize the Firebase connection
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export const auth = firebaseApp.auth();

// authenticate user anonymously, with a random id.
// Every user has a unique ID.
// This ID is saved with a cookie on the user's browser,
// so an incognito browsing will create a seperate ID.
export const authenticateAnonymously = () => {
  console.log("firebase > authenticate Anonymously");
  return auth.signInAnonymously();
};

export async function authenticateUser(email, password) {
  try {
    const user = await auth.signInWithEmailAndPassword(email, password);
    console.log("user is: " + user.user.email);
  } catch (err) {
    console.log(err);
  }
}

export const userLogout = () => {
  auth
    .signOut()
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
};

// returns pre-experiment firebase collection data
export const getInfoData = () => {
  return db.collection("preExperiment"); //.orderBy("startTime");
};

// returns questions firebase collection data
export const getQuestionsData = () => {
  return db.collection("questions");
};

// creates a new session at the database, initializes user data and parameters
export const createSession = ({
  session,
  startTime,
  parameters,
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
    questions: pollData[0] ?? [],
    answers: pollData[1] ?? [],
  };

  db.collection("sessions")
    .doc(session) // sessionID
    .set({ [startTime]: data }, { merge: true })
    .then((ref) => {
      console.log("ref of create session in FIREBASE.JS: " + ref + session);
      return "sessions";
    });
};

// returns parameters from DB. paramererSet is the name of the firebase document
export const getParametersData = (parameterSet) => {
  return db.collection("parameters").doc(parameterSet).get();
};

// returns all parameters documents
export const getAllParametersData = () => {
  return db.collection("parameters");
};

// returns all user sessions
export const getAllSessions = () => {
  return db.collection("sessions"); //.orderBy("startTime");
};

// returns specific session, by session ID
export const getSessionData = (sessionId) => {
  return db.collection("sessions").doc(sessionId).get();
};

// sets session data
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
  log,
  parametersSet,
} = {}) => {
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
  db.collection("sessions")
    .doc(session) // sessionID
    .set({ [startTime]: data }, { merge: true }) // sub-document for each session this user has
    .then((ref) => {
      console.log("ref of setSessionData in FIREBASE.JS: " + ref + session);
    }); //catch error  - .catch()
};

// delete a parameters set (from settings)
export const deleteParameters = (set) => {
  db.collection("parameters").doc(set).delete();
};

// delete a parameters set (from settings)
export const deleteQuestions = (set) => {
  db.collection("questions").doc(set).delete();
};

// delete a session
export const deleteSession = (session) => {
  db.collection("sessions")
    .doc(session) // user id
    .delete();
};

// update an item (from settings)
export const updateItem = (set, updatedItem, collection) => {
  delete updatedItem.id;
  db.collection(collection).doc(set).update(updatedItem);
};

// update a parameters set (from settings)
export const updateParameters = (set, updatedItem) => {
  delete updatedItem.id;
  db.collection("parameters").doc(set).update(updatedItem);
};

// set new parameters
export const setParameters = (set, item) => {
  return db.collection("parameters").doc(set).set(item, { merge: true });
};

// update the text+images in the pre-experiment part
export const updatePreText = (id, updatedItem) => {
  delete updatedItem.id;
  return db.collection("preExperiment").doc(id).update(updatedItem);
};

// update the questionnaire part
export const updateQuestions = (id, updatedItem) => {
  delete updatedItem.id;
  return db.collection("questions").doc(id).update(updatedItem);
};

// set new text+images set for the pre-experiment part
export const setPreText = (id, updatedItem) => {
  delete updatedItem.id;
  return db.collection("preExperiment").doc(id).set(updatedItem);
};

// set new questions set for the questionnaire part
export const setQuestions = (id, updatedItem) => {
  delete updatedItem.id;
  return db.collection("questions").doc(id).set(updatedItem);
};

// get the text+images for the pre-experiment part
export const getInfoDataById = (id) => {
  return db.collection("preExperiment").doc(id).get();
};
// get the questionnaire for the pre-experiment part
export const getQuestionsDataById = (id) => {
  return db.collection("questions").doc(id).get();
};

// not being used currently
export const setParametersOLD = ({
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
