// Seleccionar elementos
const modal = document.getElementById('ventanaEmergente');
const btnAñadirEjercicio = document.getElementById('añadir-ejercicio');
const btnCerrar = document.querySelector('.cerrar');
const btnConfirmar = document.getElementById('confirmar-ejercicio');
const btnCancelar = document.getElementById('cancelar-ejercicio');

// Abrir ventana emergente
btnAñadirEjercicio.addEventListener('click', function() {
    modal.style.display = 'block'; // Mostrar la ventana emergente
});

// Cerrar ventana emergente cuando se hace clic en "×"
btnCerrar.addEventListener('click', function() {
    modal.style.display = 'none'; // Ocultar la ventana emergente
});

// Cerrar ventana emergente cuando se hace clic en "Cancelar"
btnCancelar.addEventListener('click', function() {
    modal.style.display = 'none'; // Ocultar la ventana emergente
});

// Confirmar el ejercicio y agregarlo al contenedor
btnConfirmar.addEventListener('click', function() {
    // Obtener los valores seleccionados de los filtros
    const zonaEjercicio = Array.from(document.querySelectorAll('#zona-dropdown input:checked'))
                                .map(checkbox => checkbox.value).join(', ');
    const equipoNecesario = Array.from(document.querySelectorAll('#equipo-dropdown input:checked'))
                                 .map(checkbox => checkbox.value).join(', ');
    const objetivo = Array.from(document.querySelectorAll('#objetivo-dropdown input:checked'))
                          .map(checkbox => checkbox.value).join(', ');
    const dificultad = Array.from(document.querySelectorAll('#dificultad-dropdown input:checked'))
                            .map(checkbox => checkbox.value).join(', ');

    // Obtener la imagen seleccionada
    const archivoImagen = document.getElementById('imagen-ejercicio').files[0];

    // Crear un nuevo div de ejercicio
    const nuevoEjercicio = document.createElement('div');
    nuevoEjercicio.classList.add('ejercicio');

    // Crear el contenido para el nuevo ejercicio
    nuevoEjercicio.innerHTML = `
        <img src="" alt="Sin imagen" width="64" height="64" class="imagen-ejercicio">
        <button class="seleccionar-imagen">Seleccionar Imagen</button>
        <h1>Ejercicio con zona: ${zonaEjercicio}, Equipo: ${equipoNecesario}, Objetivo: ${objetivo}, Dificultad: ${dificultad}</h1>
        <button class="eliminar">Eliminar</button>
    `;

    // Añadir el nuevo ejercicio al contenedor
    document.querySelector('.contenedor').appendChild(nuevoEjercicio);

    // Si se seleccionó una imagen, asignarla al ejercicio
    if (archivoImagen) {
        const reader = new FileReader();
        reader.onload = function(e) {
            nuevoEjercicio.querySelector('.imagen-ejercicio').src = e.target.result;
        };
        reader.readAsDataURL(archivoImagen);
    }

    // Añadir el evento de eliminación al nuevo botón
    nuevoEjercicio.querySelector('.eliminar').addEventListener('click', function() {
        this.parentElement.remove();
    });

    // Cerrar la ventana emergente
    modal.style.display = 'none';
});

// Función para manejar la apertura y cierre de los filtros
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}
