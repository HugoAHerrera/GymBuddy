// Mostrar el modal para añadir ejercicio
document.getElementById('añadir-ejercicio').addEventListener('click', function() {
    abrirVentanaEmergente();
});

document.getElementById('contenedor-guardar').addEventListener('click', async function() {
    // Obtener el nuevo título editado del <h1> con id="titulo-rutina"
    const nuevoTitulo = document.getElementById('titulo-rutina').textContent;
    
    // Seleccionamos todos los elementos <h1> dentro del <div> con clase "ejercicio"
    const headers = document.querySelectorAll('.ejercicio h1');
    
    // Verificamos si existen elementos <h1> dentro de ".ejercicio"
    if (headers.length === 0) {
        console.log("Entra: No hay <h1> en ejercicio");
        
        // Mostramos el mensaje de advertencia en la página
        const mensajeAdvertencia = document.getElementById('mensaje-advertencia');
        mensajeAdvertencia.style.display = 'block'; // Hacemos visible el mensaje
        
        // Detenemos la ejecución de la función y evitamos que continúe
        return; // Esto termina la ejecución de la función
    }

    // Si existen <h1> en ".ejercicio", ocultamos cualquier mensaje de advertencia
    const mensajeAdvertencia = document.getElementById('mensaje-advertencia');
    mensajeAdvertencia.style.display = 'none'; // Ocultamos el mensaje de advertencia si hay elementos
    
    // Creamos un arreglo con el contenido de cada <h1> dentro de "ejercicio" y agregamos el nuevo título
    const headerContents = Array.from(headers).map(header => header.textContent);
    headerContents.unshift(nuevoTitulo); // Agrega el nuevo título al inicio del arreglo
    
    try {
        const response = await fetch('/api/guardar-rutina', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rutina: headerContents
            })
        });

        const result = await response.json();
        if (response.ok) {
            console.log("Rutina guardada correctamente", result);
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
// Confirmar ejercicio y agregarlo al contenedor
function confirmarEjercicio() {
    const contenedor = document.getElementById("contenedor");

    // Obtener el ejercicio seleccionado
    const ejercicioSeleccionado = document.querySelector('.ejercicios.seleccionado');
    if (!ejercicioSeleccionado) {
        alert("Por favor, selecciona un ejercicio");
        return;
    }

    // Crear un nuevo ejercicio en el contenedor
    const ejercicio = document.createElement("div");
    ejercicio.classList.add("ejercicio");  // Aseguramos que el div tenga la clase 'ejercicio'

    // Crear solo el título del ejercicio (sin prefijo "Nombre: ")
    const titulo = document.createElement("h1");
    titulo.textContent = ejercicioSeleccionado.querySelector('h2').textContent; // Solo el nombre del ejercicio

    // Crear el botón de eliminar ejercicio
    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar ejercicio";
    botonEliminar.classList.add("boton-eliminar");
    
    // Agregar un evento para eliminar el ejercicio
    botonEliminar.addEventListener("click", function() {
        contenedor.removeChild(ejercicio); // Eliminar el ejercicio del contenedor
    });

    // Añadir el título y el botón de eliminar al ejercicio
    ejercicio.appendChild(titulo);
    ejercicio.appendChild(botonEliminar);

    contenedor.appendChild(ejercicio);

    // Cerrar el modal de filtros
    cerrarVentanaEmergente();
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
