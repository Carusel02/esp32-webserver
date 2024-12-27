// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

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
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword };
