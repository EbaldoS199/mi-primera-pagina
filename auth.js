// auth.js — Flujo login/registro + reset + perfil en Firestore
// Requisitos en login.html:
// - <form id="loginForm"> con inputs #email, #password
// - Links/botones #toSignUp, #forgot, botón submit (id opcional #signInBtn)
// - <p id="authMessage"> para mensajes
// - <script type="module" src="./firebase-config.js"></script>
// - <script type="module" src="./auth.js"></script>

import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- Helpers de DOM ---
const $ = (sel) => document.querySelector(sel);
const form       = $("#loginForm");
const emailEl    = $("#email");
const passEl     = $("#password");
const toSignUp   = $("#toSignUp");
const forgot     = $("#forgot");
const msg        = $("#authMessage");
const submitBtn  = $("#signInBtn") || form?.querySelector('button[type="submit"]');

// Estado del modo
let mode = "login"; // "login" | "signup"

// Mensajes UI
function showMsg(text, type = "info") {
  if (!msg) return;
  msg.textContent = text || "";
  msg.style.color = type === "error" ? "#ff8a8a" : type === "success" ? "#8affb0" : "inherit";
}

// Habilitar/Deshabilitar UI mientras procesa
function setBusy(busy) {
  if (submitBtn) submitBtn.disabled = busy;
  if (emailEl)  emailEl.disabled = busy;
  if (passEl)   passEl.disabled = busy;
}

// Alterna modo iniciar sesión / crear cuenta
toSignUp?.addEventListener("click", (e) => {
  e.preventDefault();
  mode = mode === "login" ? "signup" : "login";
  showMsg(mode === "login" ? "Modo: Iniciar sesión" : "Modo: Crear cuenta");
  if (submitBtn) submitBtn.textContent = mode === "login" ? "Entrar" : "Crear cuenta";
});

// Reset de contraseña (envía email)
forgot?.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = emailEl?.value.trim();
  if (!email) {
    showMsg("Escribe tu email para recuperar la contraseña.", "error");
    emailEl?.focus();
    return;
  }
  try {
    setBusy(true);
    await sendPasswordResetEmail(auth, email);
    showMsg("Te enviamos un correo para recuperar tu contraseña.", "success");
  } catch (err) {
    console.error(err);
    showMsg(normalizeError(err), "error");
  } finally {
    setBusy(false);
  }
});

// Upsert de perfil de usuario en Firestore
async function upsertProfile(user) {
  const ref = doc(db, "profiles", user.uid);
  const snap = await getDoc(ref);
  const base = {
    email: user.email || "",
    name: user.displayName || (user.email ? user.email.split("@")[0] : "Usuario"),
    updatedAt: serverTimestamp(),
  };
  if (!snap.exists()) {
    await setDoc(ref, { ...base, createdAt: serverTimestamp() }, { merge: true });
  } else {
    await setDoc(ref, base, { merge: true });
  }
}

// Normaliza mensajes de error
function normalizeError(err) {
  const code = err?.code || "";
  if (code.includes("auth/invalid-email")) return "Email inválido.";
  if (code.includes("auth/missing-password")) return "Escribe tu contraseña.";
  if (code.includes("auth/weak-password")) return "Contraseña muy débil (mínimo 6 caracteres).";
  if (code.includes("auth/email-already-in-use")) return "Ese email ya está registrado.";
  if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password")) return "Credenciales inválidas.";
  if (code.includes("auth/user-not-found")) return "No existe una cuenta con ese email.";
  if (code.includes("network-request-failed")) return "Error de red. Verifica tu conexión.";
  return err?.message || "Ocurrió un error.";
}

// Manejo del submit (login o registro)
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailEl?.value.trim();
  const pass  = passEl?.value || "";

  if (!email || !pass) {
    showMsg("Completa email y contraseña.", "error");
    return;
  }

  try {
    setBusy(true);
    showMsg("Procesando…");

    if (mode === "login") {
      await signInWithEmailAndPassword(auth, email, pass);
      showMsg("¡Bienvenido!", "success");
    } else {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      // Opcional: poner nombre por defecto basado en el correo
      const name = email.split("@")[0];
      try { await updateProfile(cred.user, { displayName: name }); } catch {}
      await upsertProfile(cred.user);
      showMsg("Cuenta creada. ¡Listo!", "success");
    }
    // La redirección sucede en onAuthStateChanged

  } catch (err) {
    console.error(err);
    showMsg(normalizeError(err), "error");
  } finally {
    setBusy(false);
  }
});

// Observador de sesión (protege flujo y redirige si ya hay login)
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Autenticado:", user.email);
    try { await upsertProfile(user); } catch (e) { console.warn("upsert profile:", e); }
    // Redirige al área protegida
    location.href = "./interaccion.html";
  } else {
    console.log("Sin sesión");
  }
});
