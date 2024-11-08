document.getElementById("guardar-cambios").addEventListener("click", function () {
    const nuevoNombreUsuario = document.getElementById("nombre-usuario").value;
    const nuevoEmailUsuario = document.getElementById("email-usuario").value;
    const nuevaImagenUsuario = document.getElementById("imagen-usuario").files[0];

    if (nuevoNombreUsuario) {
        document.getElementById("nombre-usuario-mostrado").textContent = nuevoNombreUsuario;
    }

    if (nuevoEmailUsuario) {
        document.getElementById("email-usuario-mostrado").textContent = nuevoEmailUsuario;
    }

    if (nuevaImagenUsuario) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("imagen-mostrada").src = e.target.result;
        };
        reader.readAsDataURL(nuevaImagenUsuario);
    }

    const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");
    mensajeConfirmacion.textContent = "Se ha guardado correctamente.";
    
    
    setTimeout(() => {
        mensajeConfirmacion.textContent = "";
    }, 3000);
});

