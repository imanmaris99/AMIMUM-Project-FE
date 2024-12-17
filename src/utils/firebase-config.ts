import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC5nNJjei821JWZA97y28ilKr59VDmwIzQ",
  authDomain: "amimumherbalproject-427e5.firebaseapp.com",
  projectId: "amimumherbalproject-427e5",
  storageBucket: "amimumherbalproject-427e5.appspot.com",
  messagingSenderId: "930664033239",
  appId: "1:930664033239:web:36e1297913103fb1473992",
  measurementId: "G-QVM3PRYKV2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
