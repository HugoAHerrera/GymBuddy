const ejercicioTitulo = document.getElementById('ejercicio-titulo');
const ejercicioImagen = document.getElementById('ejercicio-imagen');

const ejercicios_restantes = [];
const imagenes_ejercicios_restantes = [];

const divEjercicios = document.getElementById('div-ejercicios');

let rutinaCargada = false;

async function cargarRutina() {
    const rutinaId = new URLSearchParams(window.location.search).get('id');
    const apiUrl = `/api/rutina-concreta?id=${rutinaId}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Error al cargar la rutina');

        const data = await response.json();
        const { rutinaNombre, ejercicios } = data;

        document.title = `Rutina - ${rutinaNombre}`;

        const rutinaTitulo = document.getElementById('rutina-titulo');
        if (rutinaTitulo) {
            rutinaTitulo.textContent = `Rutina de ${rutinaNombre}`;
        }

        const divEjercicios = document.getElementById('div-ejercicios');

        for (const [index, ejercicio] of ejercicios.entries()) {
            const ejercicioDiv = document.createElement('div');
            ejercicioDiv.classList.add('ejercicio');

            const respuesta = await fetch('/api/blobAImagenEjercicio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre_ejercicio: ejercicio }),
            });

            if (!respuesta.ok) {
                throw new Error('No se pudo cargar la imagen del ejercicio');
            }

            const datos = await respuesta.json();

            if (!datos.imagen) {
                console.error('No se recibió una imagen válida.');
                continue;
            }

            ejercicioDiv.innerHTML = `
                <img src="${datos.imagen}" alt="Ejercicio ${index + 1}" class="imagen_ejercicio">
                <h1>Ejercicio ${index + 1}: ${ejercicio}</h1>
                <button class="btn-guia">Ver Guía</button>
            `;
            divEjercicios.appendChild(ejercicioDiv);

            ejercicios_restantes.push(ejercicio);
            imagenes_ejercicios_restantes.push(datos.imagen || '../Imagenes/curl_pesas.png');
        }

        document.querySelector('.Cabecera-rutina').style.visibility = 'visible';
        divEjercicios.classList.add('show');
        document.getElementById('loading').style.display = 'none';
        rutinaCargada = true;
    } catch (error) {
        console.error('Error al cargar la rutina:', error);

        const rutinaTitulo = document.getElementById('rutina-titulo');
        if (rutinaTitulo) {
            rutinaTitulo.textContent = 'Error al cargar la rutina';
        }
    }
}


document.addEventListener("DOMContentLoaded", async function () {
    await cargarRutina();
});

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

const toggleButton = document.getElementById('boton-fijo');
const toggleText = document.getElementById('toggle-text');
const sidePanel = document.getElementById('div-chat');
const center = document.querySelector('.center');


const chatMessages = document.getElementById('div-mensajes');
const chatTextarea = document.getElementById('chat-textarea');
const sendMessageButton = document.getElementById('send-message');

function addMessage(content, type) {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = content;
    chatMessages.appendChild(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.body.addEventListener('click', (event) => {
    if (event.target.matches('.btn-guia')) {
        const h1Element = event.target.previousElementSibling;
        const rutinaNombre = h1Element.textContent.split(': ')[1];
        window.open(`/guia-ejercicios?id=${encodeURIComponent(rutinaNombre)}`, '_blank');
    }
});
