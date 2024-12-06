// Todo lo relacionado con el carrito del header
let contadorCarrito = 0;  // Número total de productos
let carrito = [];  // Lista de productos en el carrito

// Función para alternar la visibilidad del menú del carrito
function toggleCarrito() {
    const menuCarrito = document.getElementById("menu-carrito");
    menuCarrito.style.display = menuCarrito.style.display === "block" ? "none" : "block";
}

// Función para proceder a la compra
function procederCompra() {
    window.location.href = 'carro';
}

// Cerrar el menú del carrito al hacer clic fuera de él
window.onclick = function(event) {
    const menuCarrito = document.getElementById("menu-carrito");
    if (!event.target.closest('#carrito') && menuCarrito.style.display === "block") {
        menuCarrito.style.display = "none";
    }
};
