// Import the functions you need from the SDKs you need
// Use this file as a JS module. Include it in HTML with:
// <script type="module" src="firebase-config.js"></script>
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDge1bosHmEc9h4C4lBZlCA8rqx2zqfUu4",
  authDomain: "faq-aliado.firebaseapp.com",
  projectId: "faq-aliado",
  storageBucket: "faq-aliado.firebasestorage.app",
  messagingSenderId: "33969219011",
  appId: "1:33969219011:web:d825bd708d062b0f608976",
  measurementId: "G-325E1EWHSX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firestore
const db = getFirestore(app);

export { app, analytics, db };