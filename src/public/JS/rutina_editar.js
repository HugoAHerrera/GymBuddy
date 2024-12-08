document.getElementById('añadir-ejercicio').addEventListener('click', function() {
    abrirVentanaEmergente();
});

document.getElementById('rutina-actualizada').addEventListener('click', async function() {
    const nuevo_nombre_rutina = document.getElementById('rutina-titulo').innerText;
    const nuevos_ejercicios_rutina = Array.from(document.querySelectorAll('.ejercicio h1'))
        .map(ejercicio => ejercicio.innerText.replace(/^Ejercicio \d+:\s*/, '').trim())
        .join(', ');

    const guardar = [nuevo_nombre_rutina + ", " + nuevos_ejercicios_rutina];

    try {
        const response = await fetch('/api/guardar-rutina-existente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rutina: guardar,
                id_rutina: idRutina
            })
        });

        const result = await response.json();
        if (response.ok) {
            window.location.href = 'rutina';
        } else {
            console.error("Error al guardar la rutina:", result.error);
        }
    } catch (error) {
        console.error('Error de comunicación con el servidor:', error);
    }
});


// Abrir el modal
function abrirVentanaEmergente() {
    cargarEjercicios();  // Cargar los ejercicios con el nuevo nombre
    document.getElementById("ventanaEmergente").style.display = "block";
}

// Cerrar el modal
function cerrarVentanaEmergente() {
    document.getElementById("ventanaEmergente").style.display = "none";
}

// Función para mostrar u ocultar los dropdowns de selección
function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    dropdown.classList.toggle("show");
}
// Función para obtener los valores seleccionados en un filtro
function obtenerValoresSeleccionados(id) {
    const checkboxes = document.querySelectorAll(`#${id} input[type="checkbox"]:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// Filtrar los ejercicios según los valores seleccionados
function aplicarFiltros(ejerciciosData) {
    // Obtener los valores seleccionados de los filtros
    const zonasSeleccionadas = obtenerValoresSeleccionados('zona-dropdown');
    const dificultadesSeleccionadas = obtenerValoresSeleccionados('dificultad-dropdown');

    return ejerciciosData.filter(ejercicio => {
        // Filtrar por zona
        const zonaCoincide = zonasSeleccionadas.length === 0 || zonasSeleccionadas.includes(ejercicio[1]);
        
        // Filtrar por dificultad
        const dificultadCoincide = dificultadesSeleccionadas.length === 0 || dificultadesSeleccionadas.includes(ejercicio[3]);

        return zonaCoincide && dificultadCoincide;
    });
}

// Cargar y mostrar los ejercicios
function cargarEjercicios() {
    const apiUrl = '/api/rutina-nueva';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar la rutina');
            return response.json();
        })
        .then(data => {
            const { combinados } = data; // Obtener el array 'combinados' de la respuesta
            
            // Aplicar los filtros
            const ejerciciosFiltrados = aplicarFiltros(combinados);

            const listaEjercicios = document.getElementById('ejercicios-lista');
            listaEjercicios.innerHTML = ''; // Limpiar lista de ejercicios antes de añadir nuevos

            // Iterar sobre cada ejercicio filtrado
            ejerciciosFiltrados.forEach(ejercicio => {
                const [id, categoria, nombre, dificultad] = ejercicio;

                // Crear un div para cada ejercicio
                const ejercicioDiv = document.createElement('div');
                ejercicioDiv.classList.add('ejercicios');
                ejercicioDiv.id = `${id}`; // Asignar un id único al div usando el id_ejercicio

                // Crear contenido HTML dentro del div del ejercicio
                ejercicioDiv.innerHTML = `
                    <h2>${nombre}</h2> <!-- Ahora solo mostramos el nombre sin "Nombre: " -->
                    <p><span class="categoria">Categoría: ${categoria}</span></p>
                    <p><span class="dificultad">Dificultad: ${dificultad}</span></p>
                `;

                // Agregar el div del ejercicio a la lista
                listaEjercicios.appendChild(ejercicioDiv);

                // Añadir un evento de clic para seleccionar un ejercicio
                ejercicioDiv.addEventListener('click', () => {
                    // Desmarcar todos los ejercicios
                    const ejerciciosSeleccionados = document.querySelectorAll('.ejercicios');
                    ejerciciosSeleccionados.forEach(div => {
                        div.classList.remove('seleccionado');
                    });

                    // Marcar el ejercicio clicado como seleccionado
                    ejercicioDiv.classList.add('seleccionado');
                });
            });
        })
        .catch(error => {
            console.error('Hubo un error:', error);
        });
}

// Añadir evento para actualizar los filtros
document.getElementById('zona-dropdown').addEventListener('change', function() {
    cargarEjercicios(); // Vuelve a cargar los ejercicios con los filtros aplicados
});

document.getElementById('dificultad-dropdown').addEventListener('change', function() {
    cargarEjercicios(); // Vuelve a cargar los ejercicios con los filtros aplicados
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



const ejercicioTitulo = document.getElementById('ejercicio-titulo');
const ejercicioImagen = document.getElementById('ejercicio-imagen');

const ejercicios_restantes = [];
const imagenes_ejercicios_restantes = [];

const divEjercicios = document.getElementById('div-ejercicios');

let rutinaCargada = false;

let  idRutina;

let valor;
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
            rutinaTitulo.textContent = `${rutinaNombre}`;
            respuesta = await fetch('/api/obtenerIdRutina', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre_rutina: rutinaNombre }),
            });
            const data = await respuesta.json();
            idRutina = data.id_rutina;
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
                <button class="eliminar"> Eliminar </button>
            `;
            valor = index;
            
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
/*fetch('../HTML/header.html')
.then(res => res.text())
.then(html => {
    document.getElementById('header-container').innerHTML = html;
    const script = document.createElement('script');
    script.src = '../JS/header.js';
    script.defer = true;
    document.body.appendChild(script);
})*/
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

    if (event.target.matches('.eliminar')) {
        // Encuentra el contenedor del ejercicio a partir del botón
        const ejercicioDiv = event.target.closest('.ejercicio');
        const contenedor = document.getElementById("div-ejercicios");

        // Encuentra el índice del ejercicio eliminado
        const index = [...contenedor.children].indexOf(ejercicioDiv);

        // Confirma antes de eliminar (opcional)
        const confirmar = confirm('¿Estás seguro de que deseas eliminar este ejercicio?');
        if (confirmar && ejercicioDiv) {
            // Elimina del DOM
            ejercicioDiv.remove();

            // Reindexar los ejercicios restantes
            [...contenedor.children].forEach((ejercicioDiv, newIndex) => {
                const h1Element = ejercicioDiv.querySelector('h1');
                const imagen = ejercicioDiv.querySelector("img");
                // Actualizar el índice de cada ejercicio
                imagen.alt = `Ejercicio ${newIndex + 1}`;
                h1Element.textContent = `Ejercicio ${newIndex + 1}: ${h1Element.textContent.split(': ')[1]}`;
            });
        }
    }
});

// Función para agregar un nuevo ejercicio
async function confirmarEjercicio() {
    const contenedor = document.getElementById("div-ejercicios");

    // Obtener el ejercicio seleccionado
    const ejercicioSeleccionado = document.querySelector('.ejercicios.seleccionado');
    if (!ejercicioSeleccionado) {
        alert("Por favor, selecciona un ejercicio");
        return;
    }

    // Crear un nuevo div para el ejercicio
    const ejercicio = document.createElement("div");
    ejercicio.classList.add("ejercicio");

    const respuesta = await fetch('/api/blobAImagenEjercicio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
            body: JSON.stringify({ nombre_ejercicio: `${ejercicioSeleccionado.querySelector('h2').textContent}` }),
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo cargar la imagen del ejercicio');
    }

    const datos = await respuesta.json();

    if (!datos.imagen) {
        console.error('No se recibió una imagen válida.');
    }
    // Crear la imagen del ejercicio
    const imagen = document.createElement("img");
    imagen.src = `${datos.imagen}`;
    imagen.alt = `Ejercicio ${contenedor.children.length + 1}`;  // Asignar el nuevo índice
    imagen.classList.add("imagen_ejercicio");

    // Crear el título del ejercicio con el índice
    const titulo = document.createElement("h1");
    titulo.textContent = `Ejercicio ${contenedor.children.length + 1}: ${ejercicioSeleccionado.querySelector('h2').textContent}`;

    // Crear los botones
    const botonGuia = document.createElement("button");
    botonGuia.textContent = "Ver Guía";
    botonGuia.classList.add("btn-guia");

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add("eliminar");

    // Añadir el ejercicio al contenedor
    ejercicio.appendChild(imagen);
    ejercicio.appendChild(titulo);
    ejercicio.appendChild(botonGuia);
    ejercicio.appendChild(botonEliminar);
    contenedor.appendChild(ejercicio);

    // Cerrar el modal de filtros (si corresponde)
    cerrarVentanaEmergente();
}
