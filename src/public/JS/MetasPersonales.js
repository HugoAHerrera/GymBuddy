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

    // Creamos la descripcion de la meta
    const result = GoalDescription(progressContainer);

    if(result !== 0) {
        // Crear progreso de la meta
        const barContainer = document.createElement("span");
        const textoProgresoMeta = document.createTextNode(" Progreso:");
        const progresoMeta = document.createElement("progress");
        progresoMeta.id = `Meta ${metasContainer.children.length + 1}`;
        progresoMeta.max = 100;
        progresoMeta.value = 0;
        progresoMeta.style.marginBottom = "15px";

        barContainer.appendChild(textoProgresoMeta);
        barContainer.appendChild(document.createElement("br"));
        barContainer.appendChild(progresoMeta);

        // Crear recompensa de la meta
        const recompensaContainer = document.createElement("span");
        const recom = document.createTextNode(` Recompensa: ${0} KC`); // KCAmount()
        const imagenKC = document.createElement("img");
        imagenKC.src = "../Imagenes/moneda_dorada.png";
        imagenKC.title = "KC";
        imagenKC.style.marginLeft = "5px";
        imagenKC.style.width = "20px";
        imagenKC.style.height = "20px";
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
        GoalCompleted();
    }
}
// falta que no se cree el elemento si no se pone una descripcion
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

function GoalCompleted() {
    document.querySelectorAll('.meta').forEach((container) => {
        container.addEventListener('click', () => {
            // Obtener el ID de la barra de progreso
            //const progressBar = container.querySelector(".goal-container .progress-container span progress");
            const progressBar = container.querySelector(".progress-container span progress");
            if (progressBar.value === 100) {
                // hacer que obtenga la recompensa
                // animacion?
                alert("Enhorabuena!! Has conseguido KC!!");
            }
            else {
                alert(`El progreso actual de la meta está en: ${progressBar.value}%`)
            }
        });
    });
}

/*
function KCAmount() {
    // calcular la cantidad de KC propicia segun la dificultad de la meta
}

function completeGoal() {
    document.querySelector('.div-metas div').forEach((div) => {
        div.addEventListener('click', (event) => {
            //const clickedId = event.target.id; // Obtiene el id del elemento clickeado

            // Hacer que se reclamen las KC establecidas

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
*/