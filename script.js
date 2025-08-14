document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que recargue la página

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    // Aquí podrías poner validaciones reales con base de datos
    if (username && password) {
        // Guardamos el nombre en localStorage para mostrarlo en la siguiente página
        localStorage.setItem("usuario", username);

        // Redirige a la página de presentación
        window.location.href = "presentacion.html";
    } else {
        alert("Por favor, ingresa usuario y contraseña.");
    }
});
