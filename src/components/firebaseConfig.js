// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOm3CgNLqRJovs57b0THHqWF_fEor6dik",
  authDomain: "avoices-8b99a.firebaseapp.com",
  projectId: "avoices-8b99a",
  storageBucket: "avoices-8b99a.firebasestorage.app",
  messagingSenderId: "977024684569",
  appId: "1:977024684569:web:32bef8fdb4f4d5fd941088",
  measurementId: "G-ED8K3V2X92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, analytics };
