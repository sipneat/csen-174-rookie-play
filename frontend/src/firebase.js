// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVCUORVXSowI3J3QnrQM2x21zBFj6duv8",
  authDomain: "csen-174-rookie-play.firebaseapp.com",
  projectId: "csen-174-rookie-play",
  storageBucket: "csen-174-rookie-play.firebasestorage.app",
  messagingSenderId: "473781589617",
  appId: "1:473781589617:web:f68ff7fd491dddc5e32dd0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
