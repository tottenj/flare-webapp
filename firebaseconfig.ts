// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDj5h2HzdQYuOzV_UVTHiwx1golUW93INU",
  authDomain: "flare-7091a.firebaseapp.com",
  projectId: "flare-7091a",
  storageBucket: "flare-7091a.firebasestorage.app",
  messagingSenderId: "192465328955",
  appId: "1:192465328955:web:108bbe86f58f4bbcb2f51e",
  measurementId: "G-JR9NDGTPV9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);



export default app
