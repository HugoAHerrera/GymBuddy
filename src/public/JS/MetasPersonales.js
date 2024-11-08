document.addEventListener("DOMContentLoaded", function () {
    // Selecciona el botón para añadir una meta
    const addMetaButton = document.querySelector(".boton-annadir-meta");
    const metasContainer = document.querySelector(".div-metas");

    // Función para crear una nueva meta
    function crearNuevaMeta() {
        // Crear contenedor de la meta
        const nuevaMeta = document.createElement("div");
        nuevaMeta.classList.add("meta");

        // Crear imagen de la meta
        const imagenMeta = document.createElement("img");
        imagenMeta.src = "../Imagenes/logo.png";
        imagenMeta.alt = "Logo GymBuddy";
        imagenMeta.classList.add("imagen_meta");

        // Crear contenedor de título y progreso
        const goalContainer = document.createElement("div");
        goalContainer.classList.add("goal-container");

        // Crear título de la meta
        const tituloMeta = document.createElement("h1");
        tituloMeta.classList.add("goal-title");
        tituloMeta.textContent = `Meta ${metasContainer.children.length + 1}`;

        // Crear contenedor de progreso
        const progressContainer = document.createElement("div");
        progressContainer.classList.add("progress-container");

        // Crear progreso de ejercicio actual
        const textoProgresoEjercicio = document.createTextNode("Progreso ejercicio actual:");
        const progresoEjercicio = document.createElement("progress");
        progresoEjercicio.max = "100";
        progresoEjercicio.value = "0"; // valor inicial

        // Crear progreso de la meta
        const textoProgresoMeta = document.createTextNode(" Progreso Meta:");
        const progresoMeta = document.createElement("progress");
        progresoMeta.max = "100";
        progresoMeta.value = "0"; // valor inicial

        // Añadir los elementos al contenedor de progreso
        progressContainer.appendChild(textoProgresoEjercicio);
        progressContainer.appendChild(progresoEjercicio);
        progressContainer.appendChild(document.createElement("br")); // Salto de línea
        progressContainer.appendChild(textoProgresoMeta);
        progressContainer.appendChild(progresoMeta);

        // Añadir título y progreso al contenedor de la meta
        goalContainer.appendChild(tituloMeta);
        goalContainer.appendChild(progressContainer);

        // Añadir imagen y contenedor al div principal de la meta
        nuevaMeta.appendChild(imagenMeta);
        nuevaMeta.appendChild(goalContainer);

        // Añadir la nueva meta al contenedor de metas
        metasContainer.appendChild(nuevaMeta);
    }

    // Asignar el evento al botón
    addMetaButton.addEventListener("click", crearNuevaMeta);
});

