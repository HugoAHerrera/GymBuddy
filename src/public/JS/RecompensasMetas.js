
/*
Archivo para calcular el porcentage de la barra de progreso y las recompensas
en funcion de la meta:

BARRA DE PROGRESO: 0 - 100
    Aumento de la barra de progreso -> en funcion de la cantidad de ejercicios / sets que hay en la meta

    Ejemplo practico:

    Meta con 7 ejercicios, 4 de los ejercicios son de 4 sets y los demas de 3 sets.
    La barra de progreso avanzaria entonces asi:
        - Por cada ejercicio realizado -> aumenta un 1/7
        - Por cada set realizado -> aumenta 1/25

RECOMPENSAS:

    - Por establecer la cantidad de KG por ejercicio / set propuesto -> se calcula en base a la cantidad final la recompensa

 */

document.addEventListener("DOMContentLoaded", function () {
    // Selecciona todos los botones de "Reclamar"
    const claimButtons = document.querySelectorAll(".claim-gift");

    // Recorre cada botón y añade el evento de clic
    claimButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Encuentra el contenedor principal de esta meta
            const metaContainer = button.closest(".meta");
            // Selecciona la barra de progreso y la etiqueta de recompensa dentro del contenedor de la meta
            const progressBar = metaContainer.querySelector(".progress_bar");
            const rewardLabel = metaContainer.querySelector("div[id$='-gift']");

            // Comprueba si el progreso está al 100%
            if (progressBar.value === 100) {
                alert(`¡Recompensa reclamada con éxito! Has ganado: ${rewardLabel.textContent}`);
            } else {
                alert("No puedes reclamar la recompensa hasta completar el 100% de progreso.");
            }
        });
    });
});
