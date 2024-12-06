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

function cargarRutina() {
    const rutinaId = new URLSearchParams(window.location.search).get('id');
    const apiUrl = `/api/rutina-concreta?id=${rutinaId}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar la rutina');
            return response.json();
        })
        .then(data => {
            const { rutinaNombre, ejercicios } = data;

            document.title = `Rutina - ${rutinaNombre}`;

            const rutinaTitulo = document.getElementById('rutina-titulo');
            if (rutinaTitulo) {
                rutinaTitulo.textContent = `Rutina de ${rutinaNombre}`;
            }

            ejercicios.forEach((ejercicio, index) => {
                const ejercicioDiv = document.createElement('div');
                ejercicioDiv.classList.add('ejercicio');
                ejercicioDiv.innerHTML = `
                    <img src="../Imagenes/curl_pesas.png" alt="Ejercicio ${index + 1}" class="imagen_ejercicio">
                    <h1>Ejercicio ${index + 1}: ${ejercicio}</h1>
                    <button class="btn-guia">Ver Guía</button>
                `;
                divEjercicios.appendChild(ejercicioDiv);

                ejercicios_restantes.push(ejercicio);
                imagenes_ejercicios_restantes.push('../Imagenes/curl_pesas.png');
            });
            document.querySelector('.Cabecera-rutina').style.visibility = 'visible';
            document.querySelector('.tiempos-container').style.visibility = 'visible';
            divEjercicios.classList.add('show');
            document.getElementById('loading').style.display = 'none';
        })
        .catch(error => {
            console.error(error);
            const rutinaTitulo = document.getElementById('rutina-titulo');
            if (rutinaTitulo) {
                rutinaTitulo.textContent = 'Error al cargar la rutina';
            }
        });
}

document.addEventListener("DOMContentLoaded", function () {
    cargarRutina();

    document.querySelector('.boton-empezar-rutina').addEventListener('click', iniciarRutina);
    document.querySelector('.boton-pausar-rutina').addEventListener('click', pausarRutina);

    document.querySelectorAll('.btn-guia').forEach(button => {
        button.addEventListener('click', () => {
            window.open('guia_ejercicios.html', '_blank');
        });
    });

    document.querySelectorAll('.boton-crear-rutina').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = "rutina_personalizada_nueva.html";
        });
    });

    const logoImage = document.getElementById('logotype');
    logoImage.addEventListener('click', function () {
        window.location.href = 'perfil.html';
    });
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
    
    console.log('Tiempo total:', tiempoTotal);
    console.log('Fecha actual:', fechaActual);
    console.log('ID Rutina:', idRutina);

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
