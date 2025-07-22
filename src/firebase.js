import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBFho0Mf6RD8gWlypfwIJyopDhWMMYTvY0",
  authDomain: "otobingo-d60d5.firebaseapp.com",
  databaseURL: "https://otobingo-d60d5-default-rtdb.firebaseio.com",
  projectId: "otobingo-d60d5",
  storageBucket: "otobingo-d60d5.firebasestorage.app",
  messagingSenderId: "1043625628028",
  appId: "1:1043625628028:web:3a0a529c4d11616d18d4f9",
  measurementId: "G-S6G195F0GN"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
