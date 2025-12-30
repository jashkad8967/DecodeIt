// Firebase configuration
// Replace these with your actual Firebase config values
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBFW6ums36yV2UXUHaq14f87TwcqgPVhy8",
  authDomain: "decodeit7.firebaseapp.com",
  projectId: "decodeit7",
  storageBucket: "decodeit7.firebasestorage.app",
  messagingSenderId: "547353229302",
  appId: "1:547353229302:web:14c60b096baabfc74279d7",
  measurementId: "G-XJXF0PYQF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

const analytics = getAnalytics(app);
export default app;

