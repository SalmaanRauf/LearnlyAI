// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);