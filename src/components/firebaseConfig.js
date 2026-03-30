import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:            "AIzaSyDOm3CgNLqRJovs57b0THHqWF_fEor6dik",
  authDomain:        "avoices-8b99a.firebaseapp.com",
  projectId:         "avoices-8b99a",
  storageBucket:     "avoices-8b99a.firebasestorage.app",
  messagingSenderId: "977024684569",
  appId:             "1:977024684569:web:32bef8fdb4f4d5fd941088",
  measurementId:     "G-ED8K3V2X92",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, analytics };
