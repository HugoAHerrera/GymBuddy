document.getElementById('añadir-ejercicio').addEventListener('click', function() {
    // Crear un nuevo div de ejercicio
    const nuevoEjercicio = document.createElement('div');
    nuevoEjercicio.classList.add('ejercicio');

    // Crear el contenido para el nuevo ejercicio
    nuevoEjercicio.innerHTML = `
        <img src="../Imagenes/curl_pesas.png" alt="curl_pesas" width="64" height="64">
        <h1>Nuevo Ejercicio</h1>
        <button class="eliminar">Eliminar</button>
    `;

    // Añadir el nuevo ejercicio al contenedor
    document.querySelector('.contenedor').appendChild(nuevoEjercicio);

    // Añadir el evento de eliminación al nuevo botón
    nuevoEjercicio.querySelector('.eliminar').addEventListener('click', function() {
        this.parentElement.remove();
    });

    // Desplazar la página hacia abajo después de añadir el ejercicio
    window.scrollTo(0, document.body.scrollHeight);
});
