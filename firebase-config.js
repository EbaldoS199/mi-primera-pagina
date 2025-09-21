// firebase-config.js (CDN ESM v10.12.2)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyD_i3J54vqqi6o_FFtyORYkPSgRf6ViaK8",
  authDomain: "mi-primera-pagina-398ba.firebaseapp.com",
  projectId: "mi-primera-pagina-398ba",
  storageBucket: "mi-primera-pagina-398ba.firebasestorage.app",
  messagingSenderId: "407756092423",
  appId: "1:407756092423:web:3acfcec946628bf85566a2"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
