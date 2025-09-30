import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDy6r-b8lYguRPdnBBlkIEhbLb8xMlxANE",
  authDomain: "easyshoppingmall-48bf0.firebaseapp.com",
  projectId: "easyshoppingmall-48bf0",
  storageBucket: "easyshoppingmall-48bf0.firebasestorage.app",
  messagingSenderId: "108019286545",
  appId: "1:108019286545:web:f731d5ef35a5f899c727b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };