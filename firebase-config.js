// Importa lo que necesitas del SDK modular
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD_i3J54vqqi6o_FFtyORYkPSgRf6ViaK8",
  authDomain: "mi-primera-pagina-398ba.firebaseapp.com",
  projectId: "mi-primera-pagina-398ba",
  storageBucket: "mi-primera-pagina-398ba.firebasestorage.app",
  messagingSenderId: "407756092423",
  appId: "1:407756092423:web:3acfcec946628bf85566a2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
