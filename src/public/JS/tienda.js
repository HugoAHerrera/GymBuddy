// Función para mostrar más productos en "Recomendados para Ti"
function mostrarMasProductos() {
    const seccionRecomendados = document.getElementById("recomendados");

    for (let i = 1; i <= 8; i++) {
        const tarjetaProducto = document.createElement("div");
        tarjetaProducto.classList.add("tarjeta-producto");

        const imagenProducto = document.createElement("div");
        imagenProducto.classList.add("imagen-producto");
        imagenProducto.textContent = "Imagen de Producto";

        const precioProducto = document.createElement("div");
        precioProducto.classList.add("precio-producto");
        precioProducto.textContent = "Precio";

        const botonComprar = document.createElement("button");
        botonComprar.classList.add("boton-comprar");
        botonComprar.textContent = "Comprar";
        botonComprar.onclick = () => añadirAlCarrito(`Producto de ejemplo`);

        // Agregar elementos a la tarjeta de producto
        tarjetaProducto.appendChild(imagenProducto);
        tarjetaProducto.appendChild(precioProducto);
        tarjetaProducto.appendChild(botonComprar);

        // Añadir tarjeta a la sección "Recomendados para Ti"
        seccionRecomendados.appendChild(tarjetaProducto);
    }
}

// Función de búsqueda de productos
function buscarProductos() {
    const input = document.getElementById("buscador-productos").value.toLowerCase();
    const productos = document.querySelectorAll(".tarjeta-producto");
    
    productos.forEach(producto => {
        const nombreProducto = producto.querySelector(".imagen-producto").textContent.toLowerCase();
        
        // Si el nombre del producto incluye el texto del buscador, se muestra; de lo contrario, se oculta
        if (nombreProducto.includes(input)) {
            producto.classList.remove("oculto");
        } else {
            producto.classList.add("oculto");
        }
    });
}
document.getElementById("buscador-productos").addEventListener("input", buscarProductos);


//Todo lo relacionado con el carrito
let contadorCarrito = 0;
let carrito = [];

// Función para alternar la visibilidad del menú del carrito
function toggleCarrito() {
    const menuCarrito = document.getElementById("menu-carrito");
    menuCarrito.style.display = menuCarrito.style.display === "block" ? "none" : "block";
}

// Función para añadir un producto al carrito
function añadirAlCarrito(nombreProducto) {
    alert(`Su artículo "${nombreProducto}" fue añadido a la cesta`);

    // Añadir producto al carrito y actualizar contador
    carrito.push(nombreProducto);
    contadorCarrito++;
    document.getElementById("contador-carrito").textContent = contadorCarrito;

    // Actualizar la lista de productos en el menú del carrito
    actualizarListaCarrito();
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
