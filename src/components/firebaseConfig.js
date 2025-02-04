// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDhPhzHGEYJtQFstZXfClmgPcxWtu-_g1w",
  authDomain: "carryit-7fe2b.firebaseapp.com",
  databaseURL: "https://carryit-7fe2b-default-rtdb.firebaseio.com",
  projectId: "carryit-7fe2b",
  storageBucket: "carryit-7fe2b.appspot.com",
  messagingSenderId: "471725784313",
  appId: "1:471725784313:web:d8634779741237b0303628",
  measurementId: "G-91NWLWWYFZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export { auth };
