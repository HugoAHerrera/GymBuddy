document.getElementById("guardar-cambios").addEventListener("click", function () {

    const nuevoNombreUsuario = document.getElementById("nombre-usuario").value;
    const nuevoCorreoUsuario = document.getElementById("email-usuario").value;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    cargarImagenUsuario()
    // Verificas si el correo es válido
    if (!emailRegex.test(nuevoCorreoUsuario)) {
        // Si el correo no es válido, pones un mensaje de error en el párrafo
        document.getElementById("mensaje-confirmacion").innerText = "Introduzca un correo o un nombre de usuario válidos.";
        return;
    }
    const imagen = document.getElementById("inputImagen").files[0]; // Obtener el archivo de imagen
    cargarImagenUsuario()
    const formData = new FormData();
    formData.append("nombre_usuario", nuevoNombreUsuario);
    formData.append("correo_usuario", nuevoCorreoUsuario);
    formData.append("imagen", imagen); // Agregar la imagen al FormData
    cargarImagenUsuario()
    async function cargarImagenUsuario() {
        try {
            // Hacer una solicitud al endpoint que devuelve la imagen
            const respuesta = await fetch('/api/blobAImagen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // Para enviar cookies de sesión
            });

            if (!respuesta.ok) {
                throw new Error('No se pudo cargar la imagen del usuario');
            }

            const datos = await respuesta.json();

            if (!datos.imagen) {
                console.error('No se recibió una imagen válida.');
                return;
            }

            // Asignar la imagen al elemento <img> usando el ID
            const imgElemento = document.getElementById('imagen-mostrada');
            imgElemento.src = datos.imagen; // datos.imagen es el Base64 devuelto por la API
        } catch (error) {
            console.error('Error al cargar la imagen:', error);
        }
    }
    cargarImagenUsuario()

    fetch('/api/cambiarNombreUsuario', {
        method: 'POST',
        body: formData, // Usar formData en lugar de JSON.stringify
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw new Error(error.error); });
            }
            return response.json();
        })
        .then(data => {
            const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");
            mensajeConfirmacion.textContent = "Perfil actualizado correctamente.";
            mensajeConfirmacion.style.color = "blue";

            setTimeout(() => {
                mensajeConfirmacion.textContent = "";
            }, 3000);
        })
        .catch(error => {
            const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");
            mensajeConfirmacion.textContent = error.message;
            mensajeConfirmacion.style.color = "blue";
        });
        cargarImagenUsuario()
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
        fetch('/api/tiempoEjercicio')
        .then(response => response.json())
        .then(data2 => {
            console.log(data2.tiempo)
            if(data2.tiempo == null){
                document.getElementById('tiempo-ejercicio').innerText = "No se han registrado tus datos";
            } else {
                document.getElementById('tiempo-ejercicio').innerText = data2.tiempo + " segundos";
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
    
});

async function cargarImagenUsuario() {
    try {
        // Hacer una solicitud al endpoint que devuelve la imagen
        const respuesta = await fetch('/api/blobAImagen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Para enviar cookies de sesión
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo cargar la imagen del usuario');
        }

        const datos = await respuesta.json();

        if (!datos.imagen) {
            console.error('No se recibió una imagen válida.');
            return;
        }

        // Asignar la imagen al elemento <img> usando el ID
        const imgElemento = document.getElementById('imagen-mostrada');
        imgElemento.src = datos.imagen; // datos.imagen es el Base64 devuelto por la API
    } catch (error) {
        console.error('Error al cargar la imagen:', error);
    }
}
cargarImagenUsuario()


// Cargar el header y el footer con fetch
fetch('../HTML/header.html')
.then(res => res.text())
.then(html => {
    document.getElementById('header-container').innerHTML = html;
    const script = document.createElement('script');
    script.src = '../JS/header.js';
    script.defer = true;
    document.body.appendChild(script);
})
fetch('../HTML/footer.html')
.then(response => response.text())
.then(data => document.getElementById('footer-container').innerHTML = data);