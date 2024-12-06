// Función para cargar los datos del ejercicio desde el servidor
async function cargarEjercicio() {
    try {
        // Realizamos una solicitud POST al servidor para obtener los datos del ejercicio (excepto la imagen)
        const responseEjercicio = await fetch('/api/guia-ejercicios', {
            method: 'POST', // Solicitud tipo POST
            headers: {
                'Content-Type': 'application/json', // Indicamos que la solicitud es de tipo JSON
            },
        });

        if (!responseEjercicio.ok) {
            throw new Error('Error al obtener los datos del ejercicio');
        }

        const ejercicio = await responseEjercicio.json(); // Convertimos la respuesta en formato JSON

        // Ahora, actualizamos el HTML con los datos recibidos
        document.getElementById('nombre-ejercicio').textContent = ejercicio.nombre_ejercicio;
        document.getElementById('zona-principal').textContent = ejercicio.zona_principal;
        document.getElementById('equipo-necesario').textContent = ejercicio.equipo_necesario;
        document.getElementById('dificultad').textContent = ejercicio.dificultad;
        document.getElementById('objetivo').textContent = ejercicio.objetivo;
        document.getElementById('preparacion').textContent = ejercicio.preparacion;
        document.getElementById('ejecucion-lista').innerHTML = ejercicio.ejecucion.split('\n').map(step => `<li>${step}</li>`).join('');
        document.getElementById('consejos-lista').innerHTML = ejercicio.consejos_clave.split('\n').map(tip => `<li>${tip}</li>`).join('');

        // Ahora solicitamos la imagen del ejercicio en formato Base64
        const responseImagen = await fetch('/api/blobAImagenEjercicio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!responseImagen.ok) {
            throw new Error('Error al obtener la imagen');
        }

        const dataImagen = await responseImagen.json(); // La respuesta contendrá la imagen en Base64
        const imagenBase64 = dataImagen.imagen;

        // Establecer la imagen en el elemento img
        document.getElementById('imagen-ejercicio').src = `data:image/jpeg;base64,${imagenBase64}`;
        
    } catch (error) {
        console.error('Error al cargar los datos del ejercicio:', error);
    }
    cargarImagenUsuario()
}

async function cargarImagenUsuario() {
    try {
        // Hacer una solicitud al endpoint que devuelve la imagen
        const respuesta = await fetch('/api/blobAImagenEjercicio', {
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

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarEjercicio);


// Cargar el header y el footer con fetch
fetch('../HTML/header.html')
.then(response => response.text())
.then(data => document.getElementById('header-container').innerHTML = data);

fetch('../HTML/footer.html')
.then(response => response.text())
.then(data => document.getElementById('footer-container').innerHTML = data);