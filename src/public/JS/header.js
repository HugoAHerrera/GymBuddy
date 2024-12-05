// Todo lo relacionado con el carrito del header
let contadorCarrito = 0;  // Número total de productos
let carrito = [];  // Lista de productos en el carrito

// Función para alternar la visibilidad del menú del carrito
function toggleCarrito() {
    const menuCarrito = document.getElementById("menu-carrito");
    menuCarrito.style.display = menuCarrito.style.display === "block" ? "none" : "block";
}

// Función para actualizar el carrito
function actualizarCarrito(producto) {
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        // Si el producto ya está en el carrito, incrementamos la cantidad
        productoExistente.cantidad++;
    } else {
        // Si no está en el carrito, lo agregamos
        carrito.push({...producto, cantidad: 1});
    }

    // Actualizar el contador en el icono del carrito
    contadorCarrito++;
    document.getElementById("contador-carrito").textContent = contadorCarrito;

    // Actualizar la lista de productos en el menú del carrito
    actualizarListaCarrito();
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(indice) {
    const producto = carrito[indice];
    carrito.splice(indice, 1);
    contadorCarrito -= producto.cantidad; // Decrementar por la cantidad de productos eliminados
    document.getElementById("contador-carrito").textContent = contadorCarrito;
    actualizarListaCarrito();
}

// Función para actualizar la lista de productos en el menú del carrito
function actualizarListaCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    listaCarrito.innerHTML = "";  // Limpiar la lista de productos actual

    // Recorrer los productos en el carrito
    carrito.forEach((producto, index) => {
        const item = document.createElement("li");
        item.textContent = `${producto.nombre} - ${producto.precio}€ x ${producto.cantidad}`;

        // Crear el botón para eliminar el producto
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.onclick = () => eliminarDelCarrito(index);

        item.appendChild(botonEliminar);
        listaCarrito.appendChild(item);
    });
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
