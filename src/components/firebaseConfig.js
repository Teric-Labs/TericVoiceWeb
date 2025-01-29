// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAZz-MbEGL3LfWf1yimf8XQEANNvuhZNx4",
    authDomain: "mokoai-5ee85.firebaseapp.com",
    projectId: "mokoai-5ee85",
    storageBucket: "mokoai-5ee85.firebasestorage.app",
    messagingSenderId: "271015973905",
    appId: "1:271015973905:web:a9ef516093d957dcbb0db0",
    measurementId: "G-9VTTSJBP8C"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export { auth };
