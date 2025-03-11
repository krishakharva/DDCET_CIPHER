// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCEVTSJo_ho2JwADo-dj3BbOSEzBxalrlA",
  authDomain: "ddcet-cipher.firebaseapp.com",
  databaseURL: "https://ddcet-cipher-default-rtdb.firebaseio.com",
  projectId: "ddcet-cipher",
  storageBucket: "ddcet-cipher.appspot.com",
  messagingSenderId: "49242983062",
  appId: "1:49242983062:web:2fa23b2b84f9c7842f10b7",
  measurementId: "G-G0VQ13LXHS",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Realtime Database
const realtimeDatabase = getDatabase(firebaseApp);

// export { firebaseConfig };