var block = 0;
var block_2 = 1;
var cerrojo = 1;
document.addEventListener("DOMContentLoaded", function () {
    $.ajax({
        url: '/api/recuperarMetas',
        method: 'POST'
    });
    // Añadir una meta
    document.querySelector(".boton-annadir-meta").addEventListener("click", () => {
        crearNuevaMeta();
        aumentarProgresoConTiempo();
    });
    // Botón para borrar metas
    document.querySelector(".boton-borrar-meta").addEventListener("click", OpcionBorrarMetas);
    document.querySelector(".oculto").addEventListener("click", CancelarBorrarMetas);
});

var titulosMetas = [];
const metasContainer = document.querySelector(".div-metas");

// funcion para crear el el objeto de la meta
function crearNuevaMeta() {
    if (block_2 === 1) {
        //const metasContainer = document.querySelector(".div-metas");

        // Crear contenedor de la meta
        const nuevaMeta = document.createElement("div");
        nuevaMeta.classList.add("task");
        nuevaMeta.id = `Meta ${metasContainer.children.length + 1}`;

        // Crear botón de borrar
        const botonBorrar = document.createElement("span");
        botonBorrar.classList.add("borrar-meta-indiv");
        const borrar = document.createElement("div");
        borrar.classList.add("borrar-X");

        botonBorrar.appendChild(borrar);
        botonBorrar.addEventListener("click", () => {
            metasContainer.removeChild(nuevaMeta);
            titulosMetas.splice(titulosMetas.indexOf(nuevaMeta.querySelector(".goal-title").textContent), 1);
            // hacer llamada a BBDD
            //borrarMetaBBDD();
            //actualizarMetasBBDD();
        });

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
        titulosMetas.push(tituloMeta.textContent);

        // Crear contenedor de progreso
        const progressContainer = document.createElement("div");
        progressContainer.classList.add("progress-container");

        // Creamos la descripcion de la meta
        const goalDescription = GoalDescription(progressContainer);

        if (goalDescription !== 0) {
            // Crear progreso de la meta
            const barContainer = document.createElement("span");
            const textoProgresoMeta = document.createTextNode(" Progreso:");
            const progresoMeta = document.createElement("progress");
            progresoMeta.id = `Barra ${metasContainer.children.length + 1}`;
            progresoMeta.classList.add("BarraDeProgreso");
            progresoMeta.max = 100;
            progresoMeta.value = Math.floor(Math.random() * 101); // 0
            progresoMeta.style.marginBottom = "15px";

            barContainer.appendChild(textoProgresoMeta);
            barContainer.appendChild(document.createElement("br"));
            barContainer.appendChild(progresoMeta);

            // Crear recompensa de la meta
            const recompensaContainer = document.createElement("span");
            const KC = KCAmount();
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
            recompensaContainer.classList.add("Recompensas");

            recompensaContainer.appendChild(recom);
            recompensaContainer.appendChild(imagenKC);

            // Añadir los elementos al contenedor de progreso;
            progressContainer.appendChild(barContainer);
            progressContainer.appendChild(recompensaContainer);

            // Añadir título y progreso al contenedor de la meta
            goalContainer.appendChild(tituloMeta);
            goalContainer.appendChild(progressContainer);

            // Añadir imagen y contenedor al div principal de la meta
            nuevaMeta.appendChild(botonBorrar);
            nuevaMeta.appendChild(imagenMeta);
            nuevaMeta.appendChild(goalContainer);

            // Añadir la nueva meta al contenedor de metas
            metasContainer.appendChild(nuevaMeta);

            // guardar meta en BBDD
            guardarMetaBBDD(tituloMeta.textContent, KC);
            RequestReward(KC);
        }
    }
}

// Función para borrar metas
function OpcionBorrarMetas() {
        cerrojo = 0;
        block_2 = 0;
        const cancel = document.querySelector(".oculto");
        cancel.classList.remove("oculto");
        cancel.classList.add("boton-cancelar-borrar");
        document.querySelectorAll('.task').forEach((container) => {
            // Obtener el ID de la barra de progreso
            const progressBar = container.querySelector(".BarraDeProgreso");
            const borrar = container.querySelector(".borrar-X");
            if (progressBar.value !== 100) {
                borrar.style.display = "block";
            }
        });
}

function CancelarBorrarMetas() {
    cerrojo = 1;
    block_2 = 1;
    const cancel = document.querySelector(".boton-cancelar-borrar");
    cancel.classList.remove("boton-cancelar-borrar");
    cancel.classList.add("oculto");
    document.querySelectorAll('.task').forEach((container) => {
        // Obtener el ID de la barra de progreso
        const borrar = container.querySelector(".borrar-X");
        borrar.style.display = "none";
    });
}

// Crea la descripcion de la meta - puesta por el user
function GoalDescription(progressContainer) {
    const desc = prompt("Por favor, escriba una descripción corta de su meta.")
    if (desc !== '') {
        const words = desc.trim().split(/\s+/); // Divide el texto en palabras
        if (words.length > 35) {
            alert(`Tu descripción tiene ${words.length} palabras. Por favor, reduce el texto a 35 palabras o menos.`);  // CAMBIAR EL ALERT A OTRA COSA
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
        spanContainer.classList.add("GoalDescription");

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

// reclama la recompensa METODO INCOMPLETO
function RequestReward(KC) {
    document.querySelectorAll('.task').forEach((container) => {
        if (!container.dataset.eventAdded) {
            container.addEventListener('click', () => {
                // Obtener el ID de la barra de progreso
                const progressBar = container.querySelector(".BarraDeProgreso");
                if (progressBar.value === 100) {
                    if(block === 0) {
                        AnimacionMonedas(container);
                        EfectoFadeMeta(container);
                    }
                } else {
                    if(cerrojo === 1) {
                        alert(`El progreso actual de la meta está en: ${progressBar.value}%`)
                    }
                }
            });
            // Marca este contenedor como procesado para evitar duplicados
            container.dataset.eventAdded = "true";
        }
    });
}

// funcion de prueba para evaluar el progreso de una meta
function aumentarProgresoConTiempo() {
    // Seleccionamos todas las barras de progreso
    const barrasProgreso = document.querySelectorAll(".BarraDeProgreso");

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

// funcion para comprobar el estado de la barra de progreso
function comprobarEstadoProgreso() {
    document.querySelectorAll(".BarraDeProgreso").forEach((barra) => {
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
                    logo.src = "https://cdn-icons-png.flaticon.com/512/1006/1006656.png"; // Ruta de la nueva imagen
                    logo.style.filter = "drop-shadow(1px 1px 1px rgba(0, 0, 0, 1))";
                }
                //actualizarProgreso(barra.value);
            }
        }, 500); // Verificar cada medio segundo
    });
}

// funcion para establecer una recompensa acorde con la dificultad de la meta
function KCAmount() {
    // calcular la cantidad de KC propicia segun la dificultad de la meta
    return  Math.floor(Math.random() * 15) + 1; //0;
}

// EFECTO FADE AL QUITAR LA META
function EfectoFadeMeta(meta) {
    // Añadir clase para el efecto de fade-out
    meta.style.transition = "opacity 1s ease, visibility 1s ease";
    meta.style.opacity = "0";
    meta.style.visibility = "hidden";

    // Esperar hasta que el efecto de fade-out termine antes de eliminar el elemento
    setTimeout(() => {
        meta.remove();
        block = 0;
    }, 1000); // El tiempo debe coincidir con la duración del transition
}

function AnimacionMonedas(container) {
    block = 1;
    if(block === 1) {
        // Generar monedas
        for (let i = 0; i < 50; i++) {
            const coin = document.createElement("div");
            coin.classList.add("coin");

            // Generar posición inicial aleatoria dentro del contenedor
            const startX = Math.random() * 100; // 0% a 100% del ancho
            const startY = Math.random() * 100; // 0% a 100% del alto

            // Generar dirección de movimiento aleatoria
            const endX = Math.random() * 400 - 200; // De -200px a 200px (horizontal)
            const endY = -(Math.random() * 300 + 100); // De -100px a -400px (vertical)

            // Aplicar posición inicial
            coin.style.left = `${startX}%`;
            coin.style.top = `${startY}%`;

            // Crear animación personalizada
            coin.animate(
                [
                    {transform: `translate(0, 0)`, opacity: 1},
                    {transform: `translate(${endX}px, ${endY}px) rotate(${Math.random() * 720}deg)`, opacity: 0}
                ],
                {
                    duration: 1200,
                    easing: "ease-out",
                    fill: "forwards"
                }
            );

            container.appendChild(coin);
            // Eliminar la moneda después de la animación
            setTimeout(() => coin.remove(), 2000);
        }
    }
}

// FUNCIONES PARA BBDD
function guardarMetaBBDD(title, KC) {
    const description = document.querySelector(".GoalDescription").textContent.replace("Objetivo:", '');
    const challenge = {
        titulo: title,
        desc: description,
        recompensa: KC
    };

    console.log("esta guardando?, Challenge");

    $.ajax({
        url: '/api/guardarMeta',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(challenge)
    });
}

function borrarMetaBBDD(title) {
    $.ajax({
        url: '/api/borrarMeta',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(title)
    });
}

function actualizarMetasBBDD() {
    const metasRestantes = document.querySelectorAll(".goal-title");
    for(let i = 0; i < metasRestantes.length; i++) {
        metasRestantes[i].textContent = `Meta ${i + 1}`;
    }

    const nuevostitulos = {
        titulos: metasRestantes
    }

    $.ajax({
        url: '/api/actualizarNumeroMetas',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ titulos: nuevostitulos })
    });
}

function actualizarProgreso(progreso) {
    const goalProgress = {
        porcentage: progreso
    };

    $.ajax({
        url: '/api/actualizarProgreso',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(goalProgress)
    });
}