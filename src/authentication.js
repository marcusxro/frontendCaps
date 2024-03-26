// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-w_ZounQbm8Np68LYgcYz70ASiaqCDBk",
  authDomain: "auth-8a971.firebaseapp.com",
  projectId: "auth-8a971",
  storageBucket: "auth-8a971.appspot.com",
  messagingSenderId: "760944812183",
  appId: "1:760944812183:web:dd8faa9af3dd2ec63c09d2",
  measurementId: "G-WNEB8D2TFH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const authentication  = getAuth(app)