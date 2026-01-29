// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "siliconfeed-e4d06.firebaseapp.com",
    projectId: "siliconfeed-e4d06",
    storageBucket: "siliconfeed-e4d06.firebasestorage.app",
    messagingSenderId: "768846725955",
    appId: "1:768846725955:web:74f46c929f419eb1ea65f6",
    measurementId: "G-M5CB1DBGP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };