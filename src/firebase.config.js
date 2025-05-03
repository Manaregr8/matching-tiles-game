
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyBeiUOEm67_W-9YSdeQxOj2ChIuxuGE-14",
  authDomain: "gradiousgame.firebaseapp.com",
  projectId: "gradiousgame",
  storageBucket: "gradiousgame.firebasestorage.app",
  messagingSenderId: "855377892330",
  appId: "1:855377892330:web:92b3b6db66cc440f595893",
  measurementId: "G-PN46BF9PTS",
  databaseURL: "https://gradiousgame-default-rtdb.firebaseio.com"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
export { database };