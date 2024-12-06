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

// Función para cargar los productos desde la base de datos
async function cargarProductos() {
    try {
        // Hacer una solicitud GET para obtener los productos
        const response = await fetch('/api/productos');
        
        if (!response.ok) {
            throw new Error("Error al obtener los productos");
        }
        
        const productos = await response.json();
        console.log("Productos obtenidos:", productos);  // Verificación de los productos obtenidos

        // Referencia a la sección "Recomendados"
        const seccionRecomendados = document.getElementById("recomendados");

        // Recorrer los productos y añadirlos a la sección
        productos.forEach(producto => {
            const tarjetaProducto = document.createElement("div");
            tarjetaProducto.classList.add("tarjeta-producto");

            // Imagen del producto
            const imagenProducto = document.createElement("div");
            imagenProducto.classList.add("imagen-producto");
            imagenProducto.textContent = "Imagen de Producto"; 

            // Nombre del producto
            const nombreProducto = document.createElement("div");
            nombreProducto.classList.add("nombre-producto");
            nombreProducto.textContent = producto.nombreArticulo;

            // Precio del producto
            const precioProducto = document.createElement("div");
            precioProducto.classList.add("precio-producto");
            precioProducto.textContent = `${producto.precio} €`;

            // Botón de "Comprar"
            const botonComprar = document.createElement("button");
            botonComprar.classList.add("boton-comprar");
            botonComprar.textContent = "Comprar";
            botonComprar.onclick = () => añadirAlCarrito(producto.idArticulo, producto.nombreArticulo, producto.precio);

            // Añadir los elementos a la tarjeta de producto
            tarjetaProducto.appendChild(imagenProducto);
            tarjetaProducto.appendChild(nombreProducto);
            tarjetaProducto.appendChild(precioProducto);
            tarjetaProducto.appendChild(botonComprar);

            // Añadir la tarjeta a la sección "Recomendados"
            seccionRecomendados.appendChild(tarjetaProducto);
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Llamar la función cuando la página se cargue
document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();  // Cargar los productos al cargar la página
});

// Función de búsqueda de productos
function buscarProductos() {
    const input = document.getElementById("buscador-productos").value.toLowerCase();
    const productos = document.querySelectorAll(".tarjeta-producto");
    
    productos.forEach(producto => {
        const nombreProducto = producto.querySelector(".nombre-producto").textContent.toLowerCase();
        
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
async function añadirAlCarrito(idArticulo, nombreProducto, precio) {
    try {
        // Crear el objeto con el idArticulo y los datos del producto
        const producto = { idArticulo, nombreArticulo: nombreProducto, precio };

        // Enviar la solicitud POST al servidor para agregar el producto al carrito
        const response = await fetch('/api/agregarAlCarro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });

        if (response.ok) {
            const data = await response.json();
            alert(`El producto "${nombreProducto}" ha sido añadido al carrito.`);

            // Actualizamos el carrito visualmente
            const scriptHeader = document.querySelector("script[src='../JS/header.js']");
            if (scriptHeader) {
                // Invocamos la función actualizarCarrito que está en header.js
                if (typeof window.actualizarCarrito === 'function') {
                    window.actualizarCarrito();
                }
            }
        } else {
            alert('Error al añadir el producto al carrito.');
        }
    } catch (error) {
        console.error('Error al añadir el producto al carrito:', error);
        alert('Error al añadir el producto al carrito.');
    }
}


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