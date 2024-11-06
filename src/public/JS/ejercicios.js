// Función para mostrar/ocultar el menú desplegable al hacer clic en la flecha
function toggleDropdown(id) {
    document.getElementById(id).classList.toggle("show");
}

// Evita cerrar el menú al seleccionar una checkbox
document.querySelectorAll('.dropdown label input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que el clic cierre el menú
    });
});

// Cierra el menú desplegable al hacer clic fuera, excepto si se hace en el propio select-box
window.addEventListener("click", function(event) {
    // Solo cierra si se hace clic fuera del menú y no en el propio select-box
    if (!event.target.closest(".custom-select")) {
        var dropdowns = document.getElementsByClassName("dropdown");
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show');
        }
    }
});