let tiempoInicial = 10;
let tiempoRestante = tiempoInicial;
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

// Llamada para obtener los ejercicios desde la API
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

            // Actualizar el título de la rutina
            const rutinaTitulo = document.getElementById('rutina-titulo');
            if (rutinaTitulo) {
                rutinaTitulo.textContent = `Rutina de ${rutinaNombre}`;
            }

            // Generar dinámicamente los ejercicios
            ejercicios.forEach((ejercicio, index) => {
                const ejercicioDiv = document.createElement('div');
                ejercicioDiv.classList.add('ejercicio');
                ejercicioDiv.innerHTML = `
                    <img src="../Imagenes/curl_pesas.png" alt="Ejercicio ${index + 1}" class="imagen_ejercicio">
                    <h1>Ejercicio ${index + 1}: ${ejercicio}</h1>
                    <button class="btn-guia">Ver Guía</button>
                `;
                divEjercicios.appendChild(ejercicioDiv);

                // Almacenamos los ejercicios y las imágenes para su uso posterior
                ejercicios_restantes.push(ejercicio);
                imagenes_ejercicios_restantes.push('../Imagenes/curl_pesas.png');  // Usa la imagen correspondiente
            });

            // Mostrar los ejercicios y hacer que la rutina sea visible
            divEjercicios.classList.add('show');
        })
        .catch(error => {
            console.error(error);
            const rutinaTitulo = document.getElementById('rutina-titulo');
            if (rutinaTitulo) {
                rutinaTitulo.textContent = 'Error al cargar la rutina';
            }
        });
}

// Inicializar la rutina cuando la página haya cargado completamente
document.addEventListener("DOMContentLoaded", function () {
    cargarRutina();  // Cargar los ejercicios al cargar la página

    // Configurar los botones de empezar y pausar
    document.querySelector('.boton-empezar-rutina').addEventListener('click', iniciarRutina);
    document.querySelector('.boton-pausar-rutina').addEventListener('click', pausarRutina);

    // Configurar la guía y la creación de una nueva rutina
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

    // Agregar la funcionalidad al logo
    const logoImage = document.getElementById('logotype');
    logoImage.addEventListener('click', function () {
        window.location.href = 'perfil.html';
    });
});

function actualizarContador() {
    if (ejercicioEnCurso) {
        if (tiempoRestante > 0) {
            tiempoRestante--;
            const porcentaje = ((tiempoInicial - tiempoRestante) / tiempoInicial) * 100;
            barraProgreso.style.width = `${porcentaje}%`;
            contadorDisplay.textContent = `Tiempo restante: ${tiempoRestante} segundos`;
        } else {
            ejercicioEnCurso = false;
            tiempoRestante = tiempoInicial;
        }
    } else {
        if (tiempoRestante) {
            tiempoRestante--;
            const porcentaje = ((tiempoInicial - tiempoRestante) / tiempoInicial) * 100;
            barraProgreso.style.width = `${porcentaje}%`;
            contadorDisplay.textContent = `Tiempo descanso: ${tiempoRestante} segundos`;
            if (tiempoRestante <= 0) {
                ejercicioEnCurso = true;
                tiempoRestante = tiempoInicial;
                actualizarEjercicio();
                setTimeout(cambiarEjercicio, 1000);
            }
        }
    }
}

function actualizarEjercicio() {
    if (ejercicios_restantes.length === 0 || imagenes_ejercicios_restantes.length === 0) {
        clearInterval(tiempoIntervalo);
        document.getElementById('contador-container').style.display = 'none';
        document.getElementById('mensaje-terminado').style.display = 'block';
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
        tiempoRestante = tiempoInicial;
    } else {
        tiempoRestante = tiempoInicial;
        ejercicioEnCurso = true;
        actualizarEjercicio();
    }
}

function iniciarRutina() {
    if (primeraEjecucion) {
        document.querySelector('.boton-empezar-rutina').disabled = true;
        document.querySelector('.boton-empezar-rutina').removeEventListener('click', iniciarRutina);
        document.querySelector('.boton-crear-rutina').style.display = 'none';
        document.querySelector('.boton-pausar-rutina').style.display = 'flex';
        document.querySelector('.boton-empezar-rutina').textContent = 'Reanudar rutina';
        document.querySelector('.barra-progreso-container').style.display = 'block';
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
