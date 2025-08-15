import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// --- Registro ---
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Registro exitoso.");
      registerForm.reset();
      window.location.href = "login.html";
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  });
}

// --- Login ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Login exitoso.");
      window.location.href = "presentacion.html";
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  });
}
