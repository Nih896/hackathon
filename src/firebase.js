// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQHacj3ryy_-8i-nWkoHLJL-fvkoeCnoc",
  authDomain: "checkout-b66a6.firebaseapp.com",
  projectId: "checkout-b66a6",
  storageBucket: "checkout-b66a6.firebasestorage.app",
  messagingSenderId: "1002364219853",
  appId: "1:1002364219853:web:07649ed042a4efb8815484",
  measurementId: "G-GRW5M24NZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export default db;