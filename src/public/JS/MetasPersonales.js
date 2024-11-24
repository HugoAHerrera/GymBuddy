document.addEventListener("DOMContentLoaded", function () {
    // Añadir una meta
    const addMetaButton = document.querySelector(".boton-annadir-meta");
    addMetaButton.addEventListener("click", crearNuevaMeta);


});

// funcion para crear el el objeto de la meta
function crearNuevaMeta() {
        const metasContainer = document.querySelector(".div-metas");

        // Crear contenedor de la meta
        const nuevaMeta = document.createElement("div");
        nuevaMeta.classList.add("meta");
        nuevaMeta.id = `Task ${metasContainer.children.length + 1}`;

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
        const textoProgresoEjercicio = document.createTextNode("Objetivo:");
        const DescMeta = document.createElement("input");
        DescMeta.type = "text";
        DescMeta.placeholder = "La descripción es inmutable."; // valor inicial
        DescMeta.id = `DescripcionInmutable ${metasContainer.children.length + 1}`;

        // Crear progreso de la meta
        const textoProgresoMeta = document.createTextNode(" Progreso:");
        const progresoMeta = document.createElement("progress");
        progresoMeta.max = "100";
        progresoMeta.value = "0"; // valor inicial
        progresoMeta.style.marginBottom = "25px";

        // Crear recompensa de la meta
        const recom = document.createTextNode(` Recompensa: ${0} KC`); // KCAmount()

        // Crear imagen para la recompensa
        const imagenKC = document.createElement("img");
        imagenKC.src = "/Imagenes/moneda-dorada.png";
        imagenKC.alt = "KC Icon";
        imagenKC.style.marginLeft = "5px";
        imagenKC.style.width = "20px";
        imagenKC.style.height = "20px";

        // Añadir los elementos al contenedor de progreso
        progressContainer.appendChild(textoProgresoEjercicio);
        progressContainer.appendChild(DescMeta);
        progressContainer.appendChild(document.createElement("br")); // Salto de línea
        progressContainer.appendChild(textoProgresoMeta);
        progressContainer.appendChild(progresoMeta);
        progressContainer.appendChild(recom);
        progressContainer.appendChild(imagenKC);

        // Añadir título y progreso al contenedor de la meta
        goalContainer.appendChild(tituloMeta);
        goalContainer.appendChild(progressContainer);

        // Añadir imagen y contenedor al div principal de la meta
        nuevaMeta.appendChild(imagenMeta);
        nuevaMeta.appendChild(goalContainer);

        // Añadir la nueva meta al contenedor de metas
        metasContainer.appendChild(nuevaMeta);
    }

function KCAmount() {
    // calcular la cantidad de KC propicia segun la dificultad de la meta
}

function completeGoal() {
    document.querySelector('.div-metas div').forEach((div) => {
        div.addEventListener('click', (event) => {
            //const clickedId = event.target.id; // Obtiene el id del elemento clickeado

            // Hacer qeu se reclamen las KC establecidas

        });
    });
}

function NoDescChange(){
    document.querySelectorAll('input').forEach((input) => {
        input.addEventListener('click', (event) => {
            const clickedId = event.target.id; // Obtiene el id del elemento clickeado

            // Hacer que el input sea inmutable después de perder el foco
            if (clickedId.value.trim() !== '') {
                clickedId.setAttribute('readonly', true); // Hace que no sea editable
            }
        });
    });
}

NoDescChange();