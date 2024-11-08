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

const ejercicios = document.querySelectorAll('.ejercicio');

document.addEventListener("DOMContentLoaded", function() {
    ejercicios.forEach(function(ejercicio) {
        const titulo = ejercicio.querySelector('h1').textContent;
        ejercicios_restantes.push(titulo);

        const imagenSrc = ejercicio.querySelector('img') ? ejercicio.querySelector('img').src : null;
        imagenes_ejercicios_restantes.push(imagenSrc);
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

document.querySelector('.boton-empezar-rutina').addEventListener('click', iniciarRutina);
document.querySelector('.boton-pausar-rutina').addEventListener('click', pausarRutina);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-guia').forEach(button => {
        button.addEventListener('click', () => {
            window.open('guia_ejercicios.html', '_blank');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.boton-crear-rutina').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = "rutina_personalizada_nueva.html";
        });
    });
});