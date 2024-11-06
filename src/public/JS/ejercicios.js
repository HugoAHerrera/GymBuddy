function applyFilters() {
    const muscleGroup = document.getElementById('muscle-group').value;
    const objective = document.getElementById('objective').value;
    const equipment = document.getElementById('equipment').value;
    const difficulty = document.getElementById('difficulty').value;

    console.log("Filtros aplicados:");
    console.log("Zona Muscular:", muscleGroup);
    console.log("Objetivo:", objective);
    console.log("Equipo:", equipment);
    console.log("Dificultad:", difficulty);
    
    // Aquí se podría agregar lógica para filtrar los ejercicios visibles en base a los filtros seleccionados
}