// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnDEQpL1U_vDs1LUM9qGp-zJ2HTYLWvLI",
  authDomain: "neuroform-c81a8.firebaseapp.com",
  projectId: "neuroform-c81a8",
  storageBucket: "neuroform-c81a8.firebasestorage.app",
  messagingSenderId: "896322498826",
  appId: "1:896322498826:web:37b5820a39dbdd8e8b4af3",
  measurementId: "G-S4PHL377W9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

export { auth };
