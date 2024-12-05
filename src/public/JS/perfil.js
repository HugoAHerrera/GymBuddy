document.getElementById("guardar-cambios").addEventListener("click", function () {
    const nuevoNombreUsuario = document.getElementById("nombre-usuario").value;
    const nuevoCorreoUsuario = document.getElementById("email-usuario").value;

    // Validamos que ambos campos tengan datos (opcional, dependiendo de tus requerimientos)
    if (!nuevoNombreUsuario || !nuevoCorreoUsuario) {
        alert("Por favor, completa todos los campos antes de guardar.");
        return;
    }

    // Actualizamos el nombre y correo visibles en la página
    if (nuevoNombreUsuario) {
        document.getElementById("nombre-usuario-mostrado").textContent = nuevoNombreUsuario;
    }

    if (nuevoCorreoUsuario) {
        document.getElementById("email-usuario-mostrado").textContent = nuevoCorreoUsuario;
    }

    // Mostrar mensaje de confirmación
    const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");
    mensajeConfirmacion.textContent = "Se han guardado los cambios correctamente.";

    // Crear un objeto JSON con el nombre y correo
    const data = {
        nombre_usuario: nuevoNombreUsuario,
        correo_usuario: nuevoCorreoUsuario
    };

    // Realizar la solicitud POST al servidor para actualizar los datos
    fetch('/api/cambiarNombreUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Enviamos los datos como JSON
        },
        body: JSON.stringify(data) // Convertimos el objeto `data` a JSON
    })
    .then(response => response.json()) // Parseamos la respuesta como JSON
    .then(data => {
        // Manejo de la respuesta del servidor
        if (data.nuevoNombreUsuario) {
            console.log('Nuevo nombre de usuario:', data.nuevoNombreUsuario);
        }
        if (data.nuevoCorreoUsuario) {
            console.log('Nuevo correo del usuario:', data.nuevoCorreoUsuario);
        }
    })
    .catch(error => {
        console.error('Error al guardar los cambios:', error);
    });

    // Limpiar el mensaje de confirmación después de 3 segundos
    setTimeout(() => {
        mensajeConfirmacion.textContent = "";
    }, 3000);
});

document.addEventListener('DOMContentLoaded', function () {
    // Hacemos una solicitud al servidor para obtener los datos del usuario
    fetch('/api/obtenerDatosUsuario')
        .then(response => response.json())
        .then(data => {
            // Rellenamos los campos con los datos obtenidos
            document.getElementById('nombre-usuario').value = data.nombre_usuario;
            document.getElementById('email-usuario').value = data.correo;
        })
        .catch(error => {
            console.error('Error al cargar los datos del usuario:', error);
        });
});


// Cargar el header y el footer con fetch
fetch('../HTML/header.html')
.then(response => response.text())
.then(data => document.getElementById('header-container').innerHTML = data);

fetch('../HTML/footer.html')
.then(response => response.text())
.then(data => document.getElementById('footer-container').innerHTML = data);