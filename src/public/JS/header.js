//Todo lo relacionado con el carrito del header
let contadorCarrito = 0;
let carrito = [];

// Función para alternar la visibilidad del menú del carrito
function toggleCarrito() {
    const menuCarrito = document.getElementById("menu-carrito");
    menuCarrito.style.display = menuCarrito.style.display === "block" ? "none" : "block";
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(indice) {
    carrito.splice(indice, 1);
    contadorCarrito--;
    document.getElementById("contador-carrito").textContent = contadorCarrito;
    actualizarListaCarrito();
}

// Función para actualizar la lista de productos en el menú del carrito
function actualizarListaCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    listaCarrito.innerHTML = "";

    carrito.forEach((producto, index) => {
        const item = document.createElement("li");
        item.textContent = producto;

        // Botón para eliminar el producto
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.onclick = () => eliminarDelCarrito(index);

        item.appendChild(botonEliminar);
        listaCarrito.appendChild(item);
    });
}

// Función para proceder a la compra
function procederCompra() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
    } else {
        window.location.href = "carro.html";
    }
}

// Cerrar el menú del carrito al hacer clic fuera de él
window.onclick = function(event) {
    const menuCarrito = document.getElementById("menu-carrito");
    if (!event.target.closest('#carrito') && menuCarrito.style.display === "block") {
        menuCarrito.style.display = "none";
    }
};