// --- FIREBASE IMPORTS ---
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { 
    getAuth, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    signInWithCustomToken
} from "firebase/auth";

// --- FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyB6QJU2LEItWtTCc6tNlWa0L7dmuHtiKEk",
  authDomain: "autotap-5ea31.firebaseapp.com",
  projectId: "autotap-5ea31",
  storageBucket: "autotap-5ea31.firebasestorage.app",
  messagingSenderId: "58871470232",
  appId: "1:58871470232:web:30bd051d1edaa0a068d8ed",
  measurementId: "G-9P0HT37CWD"
};

// --- FIREBASE INITIALIZATION ---
// Инициализируем Firebase один раз при загрузке приложения для стабильности
let app, auth, db;
if (firebaseConfig && Object.keys(firebaseConfig).length > 0) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    } catch (e) {
        console.error("Firebase initialization error:", e);
    }
}

// Export initialized Firebase services and GoogleAuthProvider
// Экспортируем инициализированные сервисы Firebase и GoogleAuthProvider
export { app, auth, db, GoogleAuthProvider, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, signInWithCustomToken, doc, setDoc, getDoc };


