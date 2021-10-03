

// Optionally import the services that you want to use
//import "firebase/auth";
//import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase


import firebase from 'firebase/app';
import 'firebase/auth';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCUfR1H5K2DBXaGvXGlezNG5h3wwGFU9fM",
  authDomain: "grocery-app-308513.firebaseapp.com",
  databaseURL: 'https://grocery-app-308513-default-rtdb.firebaseio.com/',
  projectId: "grocery-app-308513",
  storageBucket: "grocery-app-308513.appspot.com",
  messagingSenderId: "121785176960",
  appId: "1:121785176960:web:c6373fd0f124734696a765",
  measurementId: "G-CH4MPRDNKH"
};

let Firebase;

if (firebase.apps.length === 0) {
  Firebase = firebase.initializeApp(firebaseConfig);
}


export default Firebase;