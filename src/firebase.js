import firebase from "firebase";

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

export { db };
