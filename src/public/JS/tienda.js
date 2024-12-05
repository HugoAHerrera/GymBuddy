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

document.addEventListener('DOMContentLoaded', function() {
    const logoImage = document.getElementById('logotype');
    
    logoImage.addEventListener('click', function() {
        window.location.href = 'perfil.html';
    });
});

// Cargar el header y el footer con fetch
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