async function cargarEjercicio() {
    try {
        // Obtener el parámetro 'id' de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const nombreEjercicio = urlParams.get('id'); // 'id' es el parámetro en la URL

        document.title = `Guía - ${nombreEjercicio}`;
        if (!nombreEjercicio) {
            throw new Error('No se proporcionó un nombre de ejercicio en la URL.');
        }
        
        cargarImagenUsuario()

        // Realizamos una solicitud POST al servidor para obtener los datos del ejercicio
        const responseEjercicio = await fetch('/api/guia-ejercicios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre_ejercicio: nombreEjercicio }), // Enviar el nombre del ejercicio
        });

        if (!responseEjercicio.ok) {
            throw new Error('Error al obtener los datos del ejercicio');
        }

        const ejercicio = await responseEjercicio.json(); // Convertimos la respuesta en formato JSON

        // Actualizamos el HTML con los datos recibidos
        document.getElementById('nombre-ejercicio').textContent = ejercicio.nombre_ejercicio;
        document.getElementById('zona-principal').textContent = ejercicio.zona_principal;
        document.getElementById('equipo-necesario').textContent = ejercicio.equipo_necesario;
        document.getElementById('dificultad').textContent = ejercicio.dificultad;
        document.getElementById('objetivo').textContent = ejercicio.objetivo;

        document.getElementById('preparacion-lista').innerHTML = ejercicio.preparacion
            .split('. ')
            .map(step => `<li>${step.trim()}.</li>`)
            .join('');

        document.getElementById('ejecucion-lista').innerHTML = ejercicio.ejecucion
            .split('. ')
            .map(step => `<li>${step.trim()}.</li>`)
            .join('');

        document.getElementById('consejos-lista').innerHTML = ejercicio.consejos_clave
            .split('. ')
            .map(step => `<li>${step.trim()}.</li>`)
            .join('');


    } catch (error) {
        console.error('Error al cargar los datos del ejercicio:', error);
    }
}


async function cargarImagenUsuario() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const nombreEjercicio = urlParams.get('id'); // 'id' es el parámetro en la URL

        if (!nombreEjercicio) {
            throw new Error('No se proporcionó un nombre de ejercicio en la URL.');
        }

        // Realizamos una solicitud POST al servidor para obtener los datos del ejercicio
        const respuesta = await fetch('/api/blobAImagenEjercicio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre_ejercicio: nombreEjercicio }), // Enviar el nombre del ejercicio
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo cargar la imagen del usuario');
        }

        const datos = await respuesta.json();

        if (!datos.imagen) {
            console.error('No se recibió una imagen válida.');
            return;
        }

        const imgElemento = document.getElementById('imagen-ejercicio');
        imgElemento.src = datos.imagen; // datos.imagen es el Base64 devuelto por la API
    } catch (error) {
        console.error('Error al cargar la imagen:', error);
    }
}


// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarEjercicio);


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