let productosTodos = [];
let indiceActual = 0; // Índice para controlar cuántos productos se muestran

// Función para cargar los productos desde la base de datos
async function cargarProductos() {
    try {
        // Hacer una solicitud GET para obtener los productos
        const response = await fetch('/api/productos');
        
        if (!response.ok) {
            throw new Error("Error al obtener los productos");
        }
        
        const productos = await response.json();
        productosTodos = productos; // Guardamos los productos en la variable global
        mostrarProductosIniciales(); // Mostrar los primeros productos
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Función para cargar los productos más vendidos
async function cargarMasVendidos() {
    try {
        const response = await fetch('/api/mas-vendidos');
        if (!response.ok) {
            throw new Error("Error al obtener los productos más vendidos");
        }

        const masVendidos = await response.json();
        const seccionMasVendidos = document.getElementById("mas-vendidos");

        masVendidos.forEach(producto => {
            const tarjetaProducto = crearTarjetaProducto(producto);
            seccionMasVendidos.appendChild(tarjetaProducto);
        });
    } catch (error) {
        console.error('Error al cargar los productos más vendidos:', error);
    }
}

// Función para cargar las ofertas actuales
async function cargarOfertasActuales() {
    try {
        const response = await fetch('/api/ofertas-actuales');
        if (!response.ok) {
            throw new Error("Error al obtener las ofertas actuales");
        }

        const ofertas = await response.json();
        const seccionOfertasActuales = document.getElementById("ofertas-actuales");

        ofertas.forEach(producto => {
            const tarjetaProducto = crearTarjetaProducto(producto); // Reutilizamos la función para crear tarjetas
            seccionOfertasActuales.appendChild(tarjetaProducto);
        });
    } catch (error) {
        console.error('Error al cargar las ofertas actuales:', error);
    }
}


// Función para mostrar los primeros 6 productos al cargar la página
function mostrarProductosIniciales() {
    const seccionTodos = document.getElementById("todos");
    const cantidadInicial = 6;

    productosTodos.slice(indiceActual, cantidadInicial).forEach(producto => {
        const tarjetaProducto = crearTarjetaProducto(producto);
        seccionTodos.appendChild(tarjetaProducto);
    });

    indiceActual += cantidadInicial;
}

// Función para manejar el botón "Ver Más"
function mostrarMasProductos() {
    const seccionTodos = document.getElementById("todos");
    const botonVerMas = document.getElementById("ver-mas");

    const cantidadAMostrar = 3;
    const nuevosProductos = productosTodos.slice(indiceActual, indiceActual + cantidadAMostrar);

    nuevosProductos.forEach(producto => {
        const tarjetaProducto = crearTarjetaProducto(producto);
        seccionTodos.appendChild(tarjetaProducto);
    });

    indiceActual += nuevosProductos.length;

    // Ocultar el botón si no quedan más productos por mostrar
    if (indiceActual >= productosTodos.length) {
        botonVerMas.style.display = "none";
    }
}

// Función para crear la tarjeta de producto
function crearTarjetaProducto(producto) {
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

    return tarjetaProducto;
}

// Llamar a las funciones que cargan las secciones al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
});

document.addEventListener('DOMContentLoaded', function() {
    cargarMasVendidos();
});

document.addEventListener('DOMContentLoaded', function() {
    cargarOfertasActuales(); // Llamada para "Ofertas Actuales"
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