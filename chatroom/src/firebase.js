// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdCwBAd4JGbyKpS2_pGZcpYkfj8qR9Hhc",
  authDomain: "chatroomapp-22024961.firebaseapp.com",
  projectId: "chatroomapp-22024961",
  storageBucket: "chatroomapp-22024961.appspot.com",
  messagingSenderId: "503256342787",
  appId: "1:503256342787:web:7a0ccf31afc03719388936",
  measurementId: "G-CWD6MBX6E1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);