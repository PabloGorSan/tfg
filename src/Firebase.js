// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAT9BSOexVyNIfqem1B7uCFo9GgNGmDBlU",
  authDomain: "tfgpablo-e55fb.firebaseapp.com",
  projectId: "tfgpablo-e55fb",
  storageBucket: "tfgpablo-e55fb.appspot.com",
  messagingSenderId: "1048351285535",
  appId: "1:1048351285535:web:11a36680483dba583f102a"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export {firebase}