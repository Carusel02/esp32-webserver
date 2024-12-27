// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import {getDatabase} from "firebase/database";

// const firebaseConfig = {
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//     databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
//     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//     appId: import.meta.env.VITE_FIREBASE_APP_ID,
//     measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
// };

const firebaseConfig = {
    apiKey: "AIzaSyD-u9e_fGVyBVg0kOPxA-PlItqLzEO-4xw",
    authDomain: "esp32-2024-proiect.firebaseapp.com",
    databaseURL: "https://esp32-2024-proiect-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "esp32-2024-proiect",
    storageBucket: "esp32-2024-proiect.firebasestorage.app",
    messagingSenderId: "154530232776",
    appId: "1:154530232776:web:c4b2cfefba49adbc22e8fd",
    measurementId: "G-05G1TQDRBE"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { database, auth, googleProvider, signInWithPopup, signInWithEmailAndPassword };
