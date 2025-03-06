import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDrRKb6T...",
  authDomain: "social-51254.firebaseapp.com",
  projectId: "social-51254",
  storageBucket: "social-51254.appspot.com",
  messagingSenderId: "69174536778",
  appId: "1:69174536778:web:9f2688cd554cc9bba894b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Redirect if not logged in
onAuthStateChanged(auth, (user) => {
  if (!user && window.location.pathname !== "/login.html") {
    window.location.href = "login.html";
  }
});

// Logout function
export function logout() {
  signOut(auth).then(() => window.location.href = "login.html");
}
