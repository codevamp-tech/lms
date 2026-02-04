// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDOqNcXAe1TCza07dWSBJHEEjd6yMN8Y_Q",
    authDomain: "themrenglish-f3f71.firebaseapp.com",
    projectId: "themrenglish-f3f71",
    storageBucket: "themrenglish-f3f71.firebasestorage.app",
    messagingSenderId: "20206361542",
    appId: "1:20206361542:web:3ef4e0141955afc805f0c7",
    measurementId: "G-ZCZBF52637"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
let analytics;

if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, auth, analytics };
