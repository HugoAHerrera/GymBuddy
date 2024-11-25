document.addEventListener("DOMContentLoaded", function () {
    // Añadir una meta
    const addMetaButton = document.querySelector(".boton-annadir-meta");
    addMetaButton.addEventListener("click", () => {
        crearNuevaMeta();
        aumentarProgresoConTiempo();
    });
    // Botón para borrar metas
    const deleteMetaButton = document.querySelector(".boton-borrar-meta");
    deleteMetaButton.addEventListener("click", borrarMetas);
});

// funcion para crear el el objeto de la meta
function crearNuevaMeta() {
    const metasContainer = document.querySelector(".div-metas");

    // Crear contenedor de la meta
    const nuevaMeta = document.createElement("div");
    nuevaMeta.classList.add("task");
    nuevaMeta.id = `Meta ${metasContainer.children.length + 1}`;

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

    // Creamos la descripcion de la meta
    const result = GoalDescription(progressContainer);

    if(result !== 0) {
        // Crear progreso de la meta
        const barContainer = document.createElement("span");
        const textoProgresoMeta = document.createTextNode(" Progreso:");
        const progresoMeta = document.createElement("progress");
        progresoMeta.id = `Meta ${metasContainer.children.length + 1}`;
        progresoMeta.max = 100;
        progresoMeta.value = 95; //Math.floor(Math.random() * 101); // 0
        progresoMeta.style.marginBottom = "15px";

        barContainer.appendChild(textoProgresoMeta);
        barContainer.appendChild(document.createElement("br"));
        barContainer.appendChild(progresoMeta);

        // Crear recompensa de la meta
        const recompensaContainer = document.createElement("span");
        var KC = KCAmount();
        const recom = document.createTextNode(` Recompensa: ${KC} KC`); // KCAmount()
        const imagenKC = document.createElement("img");
        imagenKC.src = "../Imagenes/moneda_dorada.png";
        imagenKC.title = "KC";
        imagenKC.style.marginLeft = "5px";
        imagenKC.style.width = "20px";
        imagenKC.style.height = "20px";
        imagenKC.style.filter = "drop-shadow(1px 1px 1px rgba(0, 0, 0, 1))";
        recompensaContainer.style.display = "flex";
        recompensaContainer.style.justifyContent = "center";

        recompensaContainer.appendChild(recom);
        recompensaContainer.appendChild(imagenKC);

        // Añadir los elementos al contenedor de progreso;
        progressContainer.appendChild(barContainer);
        progressContainer.appendChild(recompensaContainer);

        // Añadir título y progreso al contenedor de la meta
        goalContainer.appendChild(tituloMeta);
        goalContainer.appendChild(progressContainer);

        // Añadir imagen y contenedor al div principal de la meta
        nuevaMeta.appendChild(imagenMeta);
        nuevaMeta.appendChild(goalContainer);

        // Añadir la nueva meta al contenedor de metas
        metasContainer.appendChild(nuevaMeta);
        RequestReward(KC);
    }
}

// Función para borrar metas
function borrarMetas() {
    const metasContainer = document.querySelector(".div-metas");
    const metas = document.querySelectorAll(".task");

    if (metas.length === 0) {
        alert("No hay metas para borrar.");
        return;
    }

    const opcion = prompt(
        "¿Qué deseas hacer?\n1. Borrar todas las metas.\n2. Seleccionar metas específicas para borrar.\n\nEscribe el número de tu elección:"
    );

    if (opcion === "1") {
        // Borrar todas las metas
        if (confirm("¿Estás seguro de que deseas borrar todas las metas?")) {
            metasContainer.innerHTML = ""; // Elimina todas las metas
            alert("Todas las metas han sido eliminadas.");
        }
    } else if (opcion === "2") {
        // Seleccionar metas específicas para borrar
        let metasIds = Array.from(metas).map((meta) => meta.id).join(", ");
        let idsParaBorrar = prompt(
            `Escribe los IDs de las metas que deseas borrar, separados por comas.\nMetas disponibles: ${metasIds}`
        );

        if (idsParaBorrar) {
            idsParaBorrar = idsParaBorrar
                .split(",")
                .map((id) => id.trim().toLowerCase()); // Convertir a minúsculas

            let metasBorradas = 0;
            metas.forEach((meta) => {
                if (idsParaBorrar.includes(meta.id.toLowerCase())) { // Comparar en minúsculas
                    meta.remove();
                    metasBorradas++;
                }
            });

            if (metasBorradas > 0) {
                alert(`${metasBorradas} meta(s) han sido eliminadas.`);
            } else {
                alert("No se encontraron metas con los IDs proporcionados.");
            }
        } else {
            alert("No se ha seleccionado ninguna meta para borrar.");
        }
    } else {
        alert("Opción no válida. Intenta nuevamente.");
    }
}

// Crea la descripcion de la meta - puesta por el user
function GoalDescription(progressContainer) {
    const desc = prompt("Por favor, escriba una descripción corta de su meta.")
    if (desc !== '') {
        const words = desc.trim().split(/\s+/); // Divide el texto en palabras
        if (words.length > 35) {
            alert(`Tu descripción tiene ${words.length} palabras. Por favor, reduce el texto a 35 palabras o menos.`);
            return 0; // Fallo: descripción demasiado larga
        }
        const spanContainer = document.createElement("span");
        const objetivoText = document.createTextNode(`Objetivo:`);
        const nextLine = document.createElement("br");
        const descripcionText  = document.createTextNode(desc);

        spanContainer.style.wordWrap = "break-word";
        spanContainer.style.wordBreak = "break-word";
        spanContainer.style.maxWidth = "100%"
        spanContainer.style.marginBottom = "10px";

        spanContainer.appendChild(objetivoText);
        spanContainer.appendChild(nextLine);
        spanContainer.appendChild(descripcionText);

        progressContainer.appendChild(spanContainer);
        return 1;
    }
    else {
        alert("Es obligatorio poner una descripción.");
        return 0;
    }
}

// reclama la recompensa
function RequestReward(KC) {
    document.querySelectorAll('.task').forEach((container) => {
        if (!container.dataset.eventAdded) {
            container.addEventListener('click', () => {
                // Obtener el ID de la barra de progreso
                const progressBar = container.querySelector(".progress-container span progress");
                if (progressBar.value === 100) {
                    // hacer que obtenga la recompensa
                    // animacion?
                    alert(`Enhorabuena!! Has conseguido ${KC} KC!!`);
                } else {
                    alert(`El progreso actual de la meta está en: ${progressBar.value}%`)
                }
            });
            // Marca este contenedor como procesado para evitar duplicados
            container.dataset.eventAdded = "true";
        }
    });
}

// funcion de prueba
function aumentarProgresoConTiempo() {
    // Seleccionamos todas las barras de progreso
    const barrasProgreso = document.querySelectorAll(".progress-container progress");

    // Iteramos sobre cada barra de progreso
    barrasProgreso.forEach((barra) => {
        const intervalo = setInterval(() => {
            // Incrementamos el valor de la barra de progreso
            let valorActual = parseInt(barra.value);
            if (valorActual < barra.max) {
                barra.value = valorActual + 1; // Incrementar el progreso
            } else {
                clearInterval(intervalo); // Detener el incremento cuando llega al máximo
                // Opcional: mostrar mensaje o realizar una acción al completarse
                console.log(`Progreso completado para ${barra.id}`);
            }
        }, 1000); // Incrementar cada 1 segundo
    });
    comprobarEstadoProgreso();
}

function comprobarEstadoProgreso() {
    const barrasProgreso = document.querySelectorAll(".progress-container progress");

    barrasProgreso.forEach((barra) => {
        // Observar cambios en el progreso de cada barra
        const intervalo = setInterval(() => {
            const metaContainer = barra.closest(".task");
            const logo = metaContainer.querySelector(".imagen_meta");

            if (barra.value > 49) {
                // Cambiar el color del fondo si el progreso supera el 49%
                metaContainer.style.backgroundColor = "#56e377";
                metaContainer.style.transition = "all 0.5s ease";
            }

            if (barra.value === 100) {
                clearInterval(intervalo); // Detenemos la comprobación para esta barra

                // Cambiar el fondo de la meta completada
                metaContainer.style.backgroundColor = "#6be524";
                metaContainer.style.transition = "all 0.5s ease";

                // Cambiar la imagen del logo
                if (logo) {
                    logo.src = "../Imagenes/trophy-2.gif"; // Ruta de la nueva imagen
                    logo.style.filter = "drop-shadow(1px 1px 1px rgba(0, 0, 0, 1))";
                }
            }
        }, 500); // Verificar cada medio segundo
    });
}


function KCAmount() {
    // calcular la cantidad de KC propicia segun la dificultad de la meta
    return  Math.floor(Math.random() * 15) + 1; //0;
}
