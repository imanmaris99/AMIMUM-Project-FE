import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

/**
 * Firebase Configuration
 * 
 * IMPORTANT: The projectId must match the Firebase project configured in the backend.
 * Backend expects: "amimumherbal"
 * 
 * Update these values from Firebase Console:
 * 1. Go to Firebase Console: https://console.firebase.google.com/
 * 2. Select project: "amimumherbal"
 * 3. Go to Project Settings > General
 * 4. Copy the config values below
 */
const firebaseConfig = {
  // TODO: Update these values from Firebase Console for project "amimumherbal"
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC5nNJjei821JWZA97y28ilKr59VDmwIzQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "amimumherbal.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "amimumherbal", // Backend expects this!
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "amimumherbal.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "930664033239",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:930664033239:web:36e1297913103fb1473992",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-QVM3PRYKV2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
