// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// import { getDatabase } from "firebase/database"; // Import Realtime Database

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCEVTSJo_ho2JwADo-dj3BbOSEzBxalrlA",
//   authDomain: "ddcet-cipher.firebaseapp.com",
//   databaseURL: "https://ddcet-cipher-default-rtdb.firebaseio.com",
//   projectId: "ddcet-cipher",
//   //storageBucket: "ddcet-cipher.firebasestorage.app",
//   storageBucket: "ddcet-cipher.appspot.com",
//   messagingSenderId: "49242983062",
//   appId: "1:49242983062:web:2fa23b2b84f9c7842f10b7",
//   measurementId: "G-G0VQ13LXHS"
// };

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);
// let analytics;
// if (typeof window !== "undefined") {
//   analytics = getAnalytics(firebaseApp); // Only run analytics on the client-side
// }

// // Initialize Firestore
// const firestore = getFirestore(firebaseApp);

// const realtimeDatabase = getDatabase(firebaseApp); // Add Realtime Database

// export { firebaseApp, firestore, realtimeDatabase, firebaseConfig };

// Import required Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; // ✅ Use getAuth instead of initializeAuth

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEVTSJo_ho2JwADo-dj3BbOSEzBxalrlA",
  authDomain: "ddcet-cipher.firebaseapp.com",
  databaseURL: "https://ddcet-cipher-default-rtdb.firebaseio.com",
  projectId: "ddcet-cipher",
  storageBucket: "ddcet-cipher.appspot.com",
  messagingSenderId: "49242983062",
  appId: "1:49242983062:web:2fa23b2b84f9c7842f10b7",
  measurementId: "G-G0VQ13LXHS"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore & Realtime Database
const firestore = getFirestore(firebaseApp);
const realtimeDatabase = getDatabase(firebaseApp);

// ✅ Correctly initialize Firebase Auth
const auth = getAuth(firebaseApp); 

export { firebaseApp, firestore, realtimeDatabase, firebaseConfig };
export default auth;

