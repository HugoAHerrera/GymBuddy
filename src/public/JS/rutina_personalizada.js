document.getElementById('añadir-ejercicio').addEventListener('click', function() {
    // Crear un nuevo div de ejercicio
    const nuevoEjercicio = document.createElement('div');
    nuevoEjercicio.classList.add('ejercicio');

    // Crear el contenido para el nuevo ejercicio
    nuevoEjercicio.innerHTML = `
        <img src="" alt="Sin imagen" width="64" height="64" class="imagen-ejercicio">
        <button class="seleccionar-imagen">Seleccionar Imagen</button>
        <h1 contenteditable="true">Nuevo Ejercicio</h1>
        <button class="eliminar">Eliminar</button>
    `;

    // Añadir el nuevo ejercicio al contenedor
    document.querySelector('.contenedor').appendChild(nuevoEjercicio);

    // Añadir el evento de eliminación al nuevo botón
    nuevoEjercicio.querySelector('.eliminar').addEventListener('click', function() {
        this.parentElement.remove();
    });

    // Añadir el evento para seleccionar una imagen
    const seleccionarImagenBtn = nuevoEjercicio.querySelector('.seleccionar-imagen');
    const imagen = nuevoEjercicio.querySelector('.imagen-ejercicio');

    seleccionarImagenBtn.addEventListener('click', function() {
        // Crear un input de tipo archivo para seleccionar una imagen
        const inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.accept = 'image/*';  // Aceptar solo imágenes

        // Cuando el usuario selecciona una imagen, cargarla
        inputFile.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagen.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // Hacer clic en el input de archivo de forma programática
        inputFile.click();
    });

    // Desplazar la página hacia abajo después de añadir el ejercicio
    window.scrollTo(0, document.body.scrollHeight);
});
