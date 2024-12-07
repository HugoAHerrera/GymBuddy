let tiempoEjercicio;
let tiempoDescanso;
let tiempoTotalEjercicio;
let tiempoTotalDescanso;
let ejercicioEnCurso = true;
let tiempoIntervalo;
let pausado = false;
let primeraEjecucion = true;

const barraProgreso = document.querySelector('.barra-inner');
const contadorDisplay = document.getElementById('contador');
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
        document.querySelector('.tiempos-container').style.visibility = 'visible';
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

    if (rutinaCargada) {
        document.querySelector('.boton-empezar-rutina').addEventListener('click', iniciarRutina);
        document.querySelector('.boton-pausar-rutina').addEventListener('click', pausarRutina);
    } else {
        alert('No se pudo cargar la rutina correctamente.');
    }
});

function actualizarContador() {
    if (tiempoRestante > 0) {
        tiempoRestante--;
        const porcentaje = ejercicioEnCurso
            ? (tiempoRestante / tiempoTotalEjercicio) * 100
            : (tiempoRestante / tiempoTotalDescanso) * 100;
        barraProgreso.style.width = `${porcentaje}%`;
        contadorDisplay.textContent = ejercicioEnCurso
            ? `Tiempo restante de ejercicio: ${tiempoRestante + 1} segundos`
            : `Tiempo de descanso: ${tiempoRestante + 1} segundos`;
    } else {
        if (ejercicioEnCurso) {
            ejercicioEnCurso = false;
            tiempoRestante = tiempoTotalDescanso;
        } else {
            ejercicioEnCurso = true;
            tiempoRestante = tiempoTotalEjercicio;
            actualizarEjercicio();
        }
    }
}


function actualizarEjercicio() {
    if (ejercicios_restantes.length === 0 || imagenes_ejercicios_restantes.length === 0) {
        clearInterval(tiempoIntervalo);
        document.getElementById('contador-container').style.display = 'none';
        document.getElementById('mensaje-terminado').style.display = 'block';
        document.querySelector('.boton-pausar-rutina').style.display = 'none';
        document.querySelector('.boton-crear-rutina').style.display = 'none';
        document.querySelector('.boton-empezar-rutina').style.display = 'none';
        guardarSesion();
        return;
    }

    const titulo = ejercicios_restantes[0];
    const imagen = imagenes_ejercicios_restantes[0];

    ejercicioTitulo.textContent = titulo;
    ejercicioImagen.src = imagen;
    ejercicioImagen.alt = titulo;

    ejercicios_restantes.shift();
    imagenes_ejercicios_restantes.shift();

    document.getElementById('ejercicio-container').style.display = 'block';
}

function cambiarEjercicio() {
    if (ejercicioEnCurso) {
        tiempoEjercicio = tiempoDescanso;
    } else {
        tiempoEjercicio = tiempoDescanso;
        ejercicioEnCurso = true;
        actualizarEjercicio();
    }
}

function iniciarRutina() {
    if (primeraEjecucion) {
        tiempoEjercicio = document.getElementById("tiempo-ejercicio").value;
        tiempoDescanso = document.getElementById("tiempo-descanso").value;
        tiempoTotalEjercicio = tiempoEjercicio;
        tiempoTotalDescanso = tiempoDescanso;
        tiempoRestante = tiempoEjercicio;
        document.querySelector('.boton-empezar-rutina').disabled = true;
        document.querySelector('.boton-empezar-rutina').removeEventListener('click', iniciarRutina);
        document.querySelector('.boton-crear-rutina').style.display = 'none';
        document.querySelector('.boton-pausar-rutina').style.display = 'flex';
        document.querySelector('.boton-empezar-rutina').textContent = 'Reanudar rutina';
        document.querySelector('.barra-progreso-container').style.display = 'block';
        document.querySelector('.tiempos-container').style.display = 'none';
        primeraEjecucion = false;
    }

    actualizarEjercicio();

    if (!pausado) {
        tiempoIntervalo = setInterval(actualizarContador, 1000);
    } else {
        pausado = false;
        tiempoIntervalo = setInterval(actualizarContador, 1000);
    }
}

function pausarRutina() {
    pausado = true;
    clearInterval(tiempoIntervalo);
    document.querySelector('.boton-empezar-rutina').disabled = false;
    document.querySelector('.boton-empezar-rutina').textContent = 'Reanudar rutina';
    document.querySelector('.boton-empezar-rutina').removeEventListener('click', iniciarRutina);
    document.querySelector('.boton-empezar-rutina').addEventListener('click', reanudarRutina);
}

function reanudarRutina() {
    document.querySelector('.boton-empezar-rutina').disabled = true;
    document.querySelector('.boton-empezar-rutina').removeEventListener('click', reanudarRutina);
    tiempoIntervalo = setInterval(actualizarContador, 1000);
    document.querySelector('.boton-pausar-rutina').style.display = 'flex';
    document.querySelector('.barra-progreso-container').style.display = 'block';
}

function guardarSesion() {
    const ejercicios = document.querySelectorAll('.ejercicio');
    const cantidadDeEjercicios = ejercicios.length;
    const resulatdoTiempoTotalEjercicio = parseInt(tiempoTotalEjercicio, 10);
    const resulatdoTiempoTotalDescanso = parseInt(tiempoTotalDescanso, 10);
    const tiempoTotal = (resulatdoTiempoTotalEjercicio + resulatdoTiempoTotalDescanso) * cantidadDeEjercicios;
    const fechaActual = new Date().toISOString().split('T')[0];
    const idRutina = document.title.replace('Rutina - ', '');

    if (!tiempoTotal || !idRutina) {
        console.error('Datos insuficientes para guardar la sesión.');
        return;
    }

    fetch('/guardar-sesion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tiempo_total: tiempoTotal,
            fecha: fechaActual,
            nombre_rutina: idRutina,
        }),
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al guardar la sesión');
        return response.json();
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
        alert('Ocurrió un error al guardar la sesión.');
    });
}

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

toggleButton.addEventListener('click', function () {
    if (sidePanel.classList.contains('hidden')) {
        //Abrir el chat
        document.getElementById('div-chat').style.display = 'flex';
        sidePanel.classList.remove('hidden');
        sidePanel.classList.add('visible');
        center.style.flex = '2';
        sidePanel.style.flex = '1';
        toggleButton.classList.remove('abrir');
        toggleButton.classList.add('cerrar');
        toggleText.textContent = 'Cerrar chat';
        center.classList.add('panel-open'); 
    } else {
        //Cerrar el chat
        document.getElementById('div-chat').style.display = 'none';
        sidePanel.classList.remove('visible');
        sidePanel.classList.add('hidden');
        center.style.flex = '1';
        sidePanel.style.flex = '0';
        toggleButton.classList.remove('cerrar');
        toggleButton.classList.add('abrir');
        toggleText.textContent = 'Abrir chat';
        center.classList.remove('panel-open');
    }
});

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

sendMessageButton.addEventListener('click', async function () {
    const messageContent = chatTextarea.value.trim();
    if (messageContent) {
        addMessage(messageContent, 'sent');
        chatTextarea.value = '';

        try {
            const response = await fetch('/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageContent })
            });

            const data = await response.json();
            if (data.respuesta) {
                addMessage(data.respuesta, 'received');
            } else {
                addMessage('No se pudo obtener una respuesta del servidor.', 'received');
            }
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            addMessage('Hubo un error al comunicar con el servidor.', 'received');
        }
    }
});

chatTextarea.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessageButton.click();
    }
});

document.body.addEventListener('click', (event) => {
    if (event.target.matches('.btn-guia')) {
        const h1Element = event.target.previousElementSibling;
        const rutinaNombre = h1Element.textContent.split(': ')[1];
        window.open(`/guia-ejercicios?id=${encodeURIComponent(rutinaNombre)}`, '_blank');
    }
});