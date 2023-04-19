// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAScGooAXRopIwEzSx4FBJCTHnT6ct6IjU",
  authDomain: "an-otp.firebaseapp.com",
  projectId: "an-otp",
  storageBucket: "an-otp.appspot.com",
  messagingSenderId: "329283418937",
  appId: "1:329283418937:web:cd8ccc9839698dba6dc6e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;