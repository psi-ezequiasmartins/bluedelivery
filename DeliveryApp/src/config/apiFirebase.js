/**
* src/config/apiFirebase.js
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVZPJtP2wBvuOXEHYGETlysuE_8kwYLs4",
  authDomain: "psi-deliverybairro.firebaseapp.com",
  databaseURL: "https://psi-deliverybairro-default-rtdb.firebaseio.com",
  projectId: "psi-deliverybairro",
  storageBucket: "psi-deliverybairro.firebasestorage.app",
  messagingSenderId: "234983243246",
  appId: "1:234983243246:web:eb96adf25d986a6292a2ff",
  measurementId: "G-68L43T7X7W"
};

// Initialize Firebase
export const firebase_app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(firebase_app);

/**
* src/config/apiFirebase.js

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
};

// Verifica se as variáveis de ambiente estão sendo carregadas corretamente
console.log('Firebase Config:', firebaseConfig);

export const firebase_app = initializeApp(firebaseConfig);
*/
