var block = 0;
var block_2 = 1;
var block_3 = 0;
var cerrojo = 1;

var fechasFormateadas = [];
var dinero = 0;
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/api/recuperarMetas');
        const desafiosBBDD = await response.json();

        const result = await fetch('/api/recuperarDinero');
        dinero = await result.json();

        const desafiosCompletados = await fetch('/api/historialDesafiosCompletados');
        const claims = await desafiosCompletados.json();
        fechasFormateadas = claims.map(item => {
            const fecha = new Date(item.fecha);
            const dia = fecha.getDate();
            const mes = fecha.getMonth() + 1;
            const anio = fecha.getFullYear();
            return `${anio}-${mes}-0${dia}`;
        });

        if(desafiosBBDD.length > 0) {
            desafiosBBDD.forEach(desafio => {
                mostrarMetaDesdeBBDD(desafio);
            });
        }

        document.querySelector(".boton-annadir-meta").addEventListener("click", () => {
            crearNuevaMeta();
        });
        document.querySelector(".boton-borrar-meta").addEventListener("click", OpcionBorrarMetas);
        document.querySelector(".oculto").addEventListener("click", CancelarBorrarMetas);
    }
    catch (error) {
        console.error('Error al cargar los datos:', error);
    }
});

var titulosMetas = [];
const metasContainer = document.querySelector(".div-metas");

function crearNuevaMeta() {
    if (block_2 === 1 && titulosMetas.length < 10) {
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

        var goalDescription = GoalDescription(progressContainer);
        if (goalDescription !== '') {
            // Crear progreso de la meta
            const barContainer = document.createElement("span");
            const textContainer = document.createElement("div");
            const textContainer_2 = document.createElement("div");
            textContainer_2.classList.add("textContainer");
            const textoProgresoMeta = document.createTextNode("Progreso: 0%");
            const aumentarProgreso = document.createElement("button");
            const progresoMeta = document.createElement("progress");
            progresoMeta.id = `Barra ${metasContainer.children.length + 1}`;
            progresoMeta.classList.add("BarraDeProgreso");
            progresoMeta.max = 100;
            progresoMeta.value = 0;
            aumentarProgreso.classList.add("aumentoProg");

            textContainer_2.appendChild(textoProgresoMeta);
            textContainer.appendChild(textContainer_2);
            textContainer.appendChild(progresoMeta);
            barContainer.appendChild(textContainer);
            barContainer.appendChild(document.createElement("br"));
            barContainer.appendChild(aumentarProgreso);

            // Crear recompensa de la meta
            const recompensaContainer = document.createElement("span");
            const KC = KCAmount();
            const recom = document.createTextNode(`Recompensa: ${KC} KC`); // KCAmount()
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

            guardarMetaBBDD(tituloMeta.textContent, KC, goalDescription);

            aumentarProgreso.addEventListener("click", () => {
                autoProgreso();
            });

            // solo si has dado a opciones borrar
            botonBorrar.addEventListener("click", () => {
                if(block_3 === 1) {
                    block_3 = 0;
                    metasContainer.removeChild(nuevaMeta);
                    titulosMetas.splice(titulosMetas.indexOf(tituloMeta.textContent), 1);
                    borrarMetaBBDD(tituloMeta.textContent);
                    setTimeout(() => {
                        actualizarMetasBBDD();
                        block_3 = 1;
                    }, 1000);
                }
            });
        }
    }
    else {
        if (titulosMetas.length > 9 && block_2 === 1){
            Swal.fire({
                title: `No puedes crear mas metas en este momento. (10 máx.)`,
                confirmButtonText: 'Okey',
                confirmButtonColor: '#3085d6',
                backdrop: true,
                allowOutsideClick: true,
                allowEscapeKey: true,
            });
        }
        else {
            Swal.fire({
                title: `No puedes crear metas mientras borras otras.`,
                confirmButtonText: 'Okey',
                confirmButtonColor: '#3085d6',
                backdrop: true,
                allowOutsideClick: true,
                allowEscapeKey: true,
            });
        }
    }
}

function OpcionBorrarMetas() {
    cerrojo = 0;
    block_2 = 0;
    block_3 = 1;
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
    block_3 = 0;
    const cancel = document.querySelector(".boton-cancelar-borrar");
    cancel.classList.remove("boton-cancelar-borrar");
    cancel.classList.add("oculto");
    document.querySelectorAll('.task').forEach((container) => {
        // Obtener el ID de la barra de progreso
        const borrar = container.querySelector(".borrar-X");
        borrar.style.display = "none";
    });
}

function GoalDescription(progressContainer) {
    var desc = prompt("Por favor, escriba una descripción corta de su meta.");  // cambiar

    if (desc !== '') {
        const words = desc.trim().split(/\s+/);
        if (words.length > 35) {
            Swal.fire({
                title: `Tu descripción tiene ${words.length} palabras. Por favor, reduce el texto a 35 palabras o menos.`,
                confirmButtonText: 'Okey',
                confirmButtonColor: '#3085d6',
                backdrop: true,
                allowOutsideClick: true,
                allowEscapeKey: true,
            });
            return '';
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
        return desc.replace("Objetivo:", '');
    }
    else {
        Swal.fire({
                title: "Es obligatorio poner una descripción.",
                confirmButtonText: 'Okey',
                confirmButtonColor: '#3085d6',
                backdrop: true,
                allowOutsideClick: true,
                allowEscapeKey: true,
            });
        return '';
    }
}

// METODO INCOMPLETO
// - falta añadir la recompensa a los KC totales del user
function RequestReward(KC) {
    const lastClaim = fechasFormateadas.at(-1);
    if(fechasFormateadas.length > 0) {
        if (lastClaim < new Date().toISOString().split('T')[0]) {
            borrarFechaPreviasBBDD(fechasFormateadas.at(-1));
            fechasFormateadas.length = 0;   // vacio la lista
            fechasFormateadas.push(new Date().toISOString().split('T')[0]);
            annadirFechaReclamacionBBDD(new Date().toISOString().split('T')[0]);
            annadirDinero(KC);
        } else {
            if (fechasFormateadas.length >= 2) {
                Swal.fire({
                    title: "Ya has reclamado las maximas recompensas diarias. (2 máx.)",
                    confirmButtonText: 'Joe',
                    confirmButtonColor: '#3085d6',
                    backdrop: true,
                    allowOutsideClick: true,
                    allowEscapeKey: true,
                });
            } else {
                fechasFormateadas.push(new Date().toISOString().split('T')[0]);
                annadirFechaReclamacionBBDD(new Date().toISOString().split('T')[0]);
                annadirDinero(KC);
            }
        }
    }
    else {
        fechasFormateadas.push(new Date().toISOString().split('T')[0]);
        annadirFechaReclamacionBBDD(new Date().toISOString().split('T')[0]);
        annadirDinero(KC);
    }
}

function autoProgreso() {
    document.querySelectorAll('.task').forEach((container) => {
        if (!container.dataset.eventAdded) {
            const boton = container.querySelector(".aumentoProg");
            boton.addEventListener('click', () => {
                // Obtener el ID de la barra de progreso
                const progressBar = container.querySelector(".BarraDeProgreso");
                const mensaje = container.querySelector(".textContainer");
                var title = container.querySelector(".goal-title");
                const KC = container.querySelector(".Recompensas");
                progressBar.value += 10;
                mensaje.textContent = `Progreso: ${progressBar.value}%`;
                comprobarEstadoProgreso();
                actualizarProgresoBBDD(title.textContent, progressBar.value);
                if (progressBar.value >= 100) {
                    RequestReward(KC.textContent.match(/\d+/)[0]);
                    //fechaDeComplecionMeta(new Date().toISOString().split('T')[0]);  // añadir a metas completadas para limitar las diarias
                    titulosMetas.splice(titulosMetas.indexOf(title.textContent), 1);
                    setTimeout(() => {
                        borrarMetaBBDD(title.textContent);
                    }, 1000);
                    setTimeout(() => {
                        actualizarMetasBBDD();
                    }, 2000);

                    if(block === 0) {
                        //RequestReward(0);
                        AnimacionMonedas(container);
                        EfectoFadeMeta(container);
                    }
                }
            });
            // Marca este contenedor como procesado para evitar duplicados
            container.dataset.eventAdded = "true";
        }
    });
}

function comprobarEstadoProgreso() {
    document.querySelectorAll(".BarraDeProgreso").forEach((barra) => {
        // Observar cambios en el progreso de cada barra
        const intervalo = setInterval(() => {
            const metaContainer = barra.closest(".task");
            const logo = metaContainer.querySelector(".imagen_meta");
            const autoboton = metaContainer.querySelector(".aumentoProg");

            if (barra.value > 49) {
                metaContainer.style.backgroundColor = "#56e377";
                metaContainer.style.transition = "all 0.5s ease";
            }

            if (barra.value >= 100) {
                clearInterval(intervalo); // Detenemos la comprobación para esta barra

                metaContainer.style.backgroundColor = "#6be524";
                metaContainer.style.transition = "all 0.5s ease";
                autoboton.style.display = "none";

                if (logo) {
                    logo.src = "https://cdn-icons-png.flaticon.com/512/1006/1006656.png"; // Ruta de la nueva imagen
                    logo.style.filter = "drop-shadow(1px 1px 1px rgba(0, 0, 0, 1))";
                }
                //actualizarProgreso(barra.value);
            }
        }, 500);
    });
}

// funcion para establecer una recompensa acorde con la dificultad de la meta
function KCAmount() {
    // calcular la cantidad de KC propicia segun la dificultad de la meta
    return  Math.floor(Math.random() * 15) + 1; //0;
}

function EfectoFadeMeta(meta) {
    meta.style.transition = "opacity 1s ease, visibility 1s ease";
    meta.style.opacity = "0";
    meta.style.visibility = "hidden";

    setTimeout(() => {
        meta.remove();
        block = 0;
    }, 1000);
}

function AnimacionMonedas(container) {
    block = 1;
    if(block === 1) {
        // Obtener las dimensiones y posición del contenedor
        const { width, height, left, top } = container.getBoundingClientRect();

        // Estilo del contenedor para posicionamiento absoluto
        const containerStyles = window.getComputedStyle(container);
        const parentPosition = containerStyles.position;

        if (parentPosition !== "relative" && parentPosition !== "absolute" && parentPosition !== "fixed") {
            container.style.position = "relative"; // Asegurar posicionamiento relativo para monedas
        }

        for (let i = 0; i < 50; i++) {
            const coin = document.createElement("div");
            coin.classList.add("coin");

            // Generar posición inicial aleatoria dentro del contenedor
            const startX = Math.random() * width; // Desde 0px al ancho del contenedor
            const startY = Math.random() * height; // Desde 0px al alto del contenedor

            // Generar dirección de movimiento aleatoria
            const endX = Math.random() * 400 - 200; // De -200px a 200px (horizontal)
            const endY = -(Math.random() * 300 + 100); // De -100px a -400px (vertical)

            // Estilo inicial de la moneda
            coin.style.position = "absolute";
            coin.style.left = `${startX}px`;
            coin.style.top = `${startY}px`;

            // Crear animación personalizada
            coin.animate(
                [
                    { transform: `translate(0, 0)`, opacity: 1 },
                    { transform: `translate(${endX}px, ${endY}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
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
function guardarMetaBBDD(title, KC, description) {
    const challenge = {
        titulo: title,
        desc: description.replace("Objetivo:", ''),
        recompensa: KC
    };

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
        data: JSON.stringify({ titulo: title })
    });
}

function actualizarMetasBBDD() {
    const metasRestantes = document.querySelectorAll(".goal-title");
        const titulosBase = ["Meta 1", "Meta 2", "Meta 3", "Meta 4", "Meta 5", "Meta 6", "Meta 7", "Meta 8", "Meta 9", "Meta 10"];
        var rangoTitulos = [];
        rangoTitulos = titulosBase.slice(0, titulosMetas.length);

        var cambioTitulos = {
            antiguoTitulo: titulosMetas,
            nuevoTitulo: rangoTitulos
        }

        $.ajax({
            url: '/api/actualizarNumeroMetas',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(cambioTitulos)
        });
    for (let i = 0; i < metasRestantes.length; i++) {
        metasRestantes[i].textContent = `Meta ${i + 1}`;
        titulosMetas[i] = `Meta ${i + 1}`;
    }
}

function actualizarProgresoBBDD(title, progreso) {
    const goalProgress = {
        titulo: title,
        porcentage: progreso
    };

    $.ajax({
        url: '/api/actualizarProgreso',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(goalProgress)
    });
}

function annadirFechaReclamacionBBDD(date) {
    const nuevaFecha = {
        fecha: date
    };

    $.ajax({
        url: '/api/fechaDesafioCompletado',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(nuevaFecha)
    });
}

function borrarFechaPreviasBBDD(date) {
    const fechaObsoleta = {
        fecha: date
    };

    $.ajax({
        url: '/api/fechasDesafiosABorrar',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(fechaObsoleta)
    });
}

function annadirDinero(KC) {
    dinero[0].KC += parseInt(KC);
    const masCantidad = {
        dinero: dinero[0].KC
    };

    $.ajax({
        url: '/api/annadirDineroDesafio',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(masCantidad)
    });
}

function mostrarMetaDesdeBBDD(desafio) {
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
    tituloMeta.textContent = desafio.titulo_desafio; //`Meta ${metasContainer.children.length + 1}`;
    titulosMetas.push(tituloMeta.textContent);

    // Crear contenedor para la descripción
    const descripcionMeta = document.createElement("p");
    descripcionMeta.classList.add("goal-description");
    descripcionMeta.textContent = desafio.descripcion;

    // Crear contenedor de progreso
    const progressContainer = document.createElement("div");
    progressContainer.classList.add("progress-container");

    // Crear progreso de la meta
    const barContainer = document.createElement("span");
    const textContainer = document.createElement("div");
    const textContainer_2 = document.createElement("div");
    textContainer_2.classList.add("textContainer");
    const textoProgresoMeta = document.createTextNode(`Progreso: ${desafio.progreso}%`);
    const aumentarProgreso = document.createElement("button");
    const progresoMeta = document.createElement("progress");
    progresoMeta.id = `Barra ${metasContainer.children.length + 1}`;
    progresoMeta.classList.add("BarraDeProgreso");
    progresoMeta.max = 100;
    progresoMeta.value = desafio.progreso;
    aumentarProgreso.classList.add("aumentoProg");

    textContainer_2.appendChild(textoProgresoMeta);
    textContainer.appendChild(textContainer_2);
    textContainer.appendChild(progresoMeta);
    barContainer.appendChild(textContainer);
    barContainer.appendChild(document.createElement("br"));
    barContainer.appendChild(aumentarProgreso);

    // Crear recompensa de la meta
    const recompensaContainer = document.createElement("span");
    const recom = document.createTextNode(` Recompensa: ${desafio.recompensa} KC`);
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

    // Añadir los elementos al contenedor de progreso
    progressContainer.appendChild(barContainer);
    progressContainer.appendChild(recompensaContainer);

    // Añadir título, descripción y progreso al contenedor de la meta
    goalContainer.appendChild(tituloMeta);
    goalContainer.appendChild(descripcionMeta);
    goalContainer.appendChild(progressContainer);

    // Añadir imagen y contenedor al div principal de la meta
    nuevaMeta.appendChild(botonBorrar);
    nuevaMeta.appendChild(imagenMeta);
    nuevaMeta.appendChild(goalContainer);

    // Añadir la nueva meta al contenedor de metas
    metasContainer.appendChild(nuevaMeta);

    // Eventos
    aumentarProgreso.addEventListener("click", () => {
        autoProgreso();
    });

    botonBorrar.addEventListener("click", () => {
        if (block_3 === 1) {
            metasContainer.removeChild(nuevaMeta);
            titulosMetas.splice(titulosMetas.indexOf(tituloMeta.textContent), 1);
            borrarMetaBBDD(desafio.titulo_desafio);
            setTimeout(() => {
                actualizarMetasBBDD();
            }, 1000);
        }
    });
}

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
