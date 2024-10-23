import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
import { connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAScGooAXRopIwEzSx4FBJCTHnT6ct6IjU",
  authDomain: "an-otp.firebaseapp.com",
  projectId: "an-otp",
  storageBucket: "an-otp.appspot.com",
  messagingSenderId: "329283418937",
  appId: "1:329283418937:web:67afba1d6f7f17fc6dc6e8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
/*
if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
}
  */
 