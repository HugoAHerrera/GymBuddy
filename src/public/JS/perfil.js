document.getElementById("guardar-cambios").addEventListener("click", function () {
    const nuevoNombreUsuario = document.getElementById("nombre-usuario").value;

    // Solo si se ha ingresado un nuevo nombre de usuario, actualizamos la vista y enviamos la solicitud.
    if (nuevoNombreUsuario) {
        document.getElementById("nombre-usuario-mostrado").textContent = nuevoNombreUsuario;

        // Mostrar mensaje de confirmación
        const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");
        mensajeConfirmacion.textContent = "Se ha guardado correctamente.";

        // Crear un objeto JSON con el nombre de usuario
        const data = {
            nombre_usuario: nuevoNombreUsuario
        };

        // Realizar la solicitud POST al servidor para actualizar el nombre
        fetch('/api/cambiarNombreUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  // Enviamos los datos como JSON
            },
            body: JSON.stringify(data)  // Convertimos el objeto data a JSON
        })
        .then(response => response.json())  // Parseamos la respuesta como JSON
        .then(data => {
            // Manejo de la respuesta del servidor
            if (data.nuevoNombreUsuario) {
                console.log('Nuevo nombre de usuario:', data.nuevoNombreUsuario);
            }
        })
        .catch(error => {
            console.error('Error al guardar los cambios:', error);
        });

        // Limpiar el mensaje de confirmación después de 3 segundos
        setTimeout(() => {
            mensajeConfirmacion.textContent = "";
        }, 3000);
    } else {
        // Si no se ingresa un nombre, se muestra un mensaje de error
        alert("Por favor, ingresa un nuevo nombre de usuario.");
    }
});

// Cargar el header y el footer con fetch
fetch('../HTML/header.html')
.then(response => response.text())
.then(data => document.getElementById('header-container').innerHTML = data);

fetch('../HTML/footer.html')
.then(response => response.text())
.then(data => document.getElementById('footer-container').innerHTML = data);