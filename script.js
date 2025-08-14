// REGISTRO
const registerForm = document.getElementById("registerForm");
if(registerForm){
    registerForm.addEventListener("submit", async e => {
        e.preventDefault();
        const nombre = document.getElementById("regNombre").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;

        try{
            await firebase.auth().createUserWithEmailAndPassword(email, password);
            localStorage.setItem("usuario", nombre);
            alert("✅ Registro exitoso");
            window.location.href = "login.html";
        }catch(error){
            alert("❌ " + error.message);
        }
    });
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if(loginForm){
    loginForm.addEventListener("submit", async e => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try{
            await firebase.auth().signInWithEmailAndPassword(email, password);
            window.location.href = "presentacion.html";
        }catch(error){
            alert("❌ " + error.message);
        }
    });
}

// PRESENTACION
firebase.auth().onAuthStateChanged(user => {
    if(user){
        const nombre = localStorage.getItem("usuario") || user.email;
        const h1 = document.querySelector("h1");
        if(h1) h1.textContent = `Bienvenido, ${nombre}`;
    }else{
        if(window.location.pathname.includes("presentacion.html")){
            window.location.href = "login.html";
        }
    }
});
