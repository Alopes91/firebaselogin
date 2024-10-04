//importação de funções do firebase para autenticação e firestore e controle de estado
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBGxQKJcl15FvSCEUvjUQajL6j-NaUQUQg",
    authDomain: "loginpwii.firebaseapp.com",
    projectId: "loginpwii",
    storageBucket: "loginpwii.appspot.com",
    messagingSenderId: "281365893072",
    appId: "1:281365893072:web:86ffd0012c334bbebbf3d5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);