import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyAPkNx4VX1D9lCNVV3HJuRrU-iyM0f8I6A",
  authDomain: "an-otp.firebaseapp.com",
  projectId: "an-otp",
  storageBucket: "an-otp.appspot.com",
  messagingSenderId: "329283418937",
  appId: "1:329283418937:web:67afba1d6f7f17fc6dc6e8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();

