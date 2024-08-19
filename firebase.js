// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxrlbPpXm4ZGzy5xD6yHxLWqlyY0oQqno",
  authDomain: "flashcards-saas-ba9ff.firebaseapp.com",
  projectId: "flashcards-saas-ba9ff",
  storageBucket: "flashcards-saas-ba9ff.appspot.com",
  messagingSenderId: "718579728956",
  appId: "1:718579728956:web:f083007c577bc377463939",
  measurementId: "G-L7EQPCQH2E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

// Initialize Analytics only if in the client-side environment
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      const analytics = getAnalytics(app);
    }
  });
}

export { db }; // Export the Firestore instance
