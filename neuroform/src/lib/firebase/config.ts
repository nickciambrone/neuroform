// lib/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// config
const firebaseConfig = {
  apiKey: "AIzaSyBnDEQpL1U_vDs1LUM9qGp-zJ2HTYLWvLI",
  authDomain: "neuroform-c81a8.firebaseapp.com",
  projectId: "neuroform-c81a8",
  storageBucket: "neuroform-c81a8.firebasestorage.app",
  messagingSenderId: "896322498826",
  appId: "1:896322498826:web:37b5820a39dbdd8e8b4af3",
  measurementId: "G-S4PHL377W9"
};

// Init
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage};
