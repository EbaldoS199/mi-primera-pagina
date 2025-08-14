// --- Registro ---
const registerForm = document.getElementById("registerForm");
if(registerForm){
    registerForm.addEventListener("submit", async e=>{
        e.preventDefault();
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        try{
            await firebase.auth().createUserWithEmailAndPassword(firebase.auth(), email, password);
            alert("✅ Registro exitoso.");
            window.location.href="login.html";
        }catch(error){
            alert("❌ Error: "+error.message);
        }
    });
}

// --- Login ---
const loginForm = document.getElementById("loginForm");
if(loginForm){
    loginForm.addEventListener("submit", async e=>{
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        try{
            await firebase.auth().signInWithEmailAndPassword(firebase.auth(), email, password);
            window.location.href="presentacion.html";
        }catch(error){
            alert("❌ Error: "+error.message);
        }
    });
}
