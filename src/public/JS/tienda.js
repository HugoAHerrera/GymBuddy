let productosTodos = [];
let indiceActual = 0;

// Función para cargar los productos desde la base de datos
async function cargarProductos() {
    try {
        const response = await fetch('/api/productos');
        
        if (!response.ok) {
            throw new Error("Error al obtener los productos");
        }
        
        const productos = await response.json();
        productosTodos = productos;
        mostrarProductosIniciales();
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
            const tarjetaProducto = crearTarjetaProducto(producto);
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

    const img = document.createElement("img");
    if (producto.imagenBase64) {
        img.src = producto.imagenBase64; // Usar la imagen extraída de la base de datos en formato base64
        img.alt = `Imagen de ${producto.nombreArticulo}`;
    } else {
        console.error(`El producto "${producto.nombreArticulo}" no tiene una imagen asignada.`);
    }
    imagenProducto.appendChild(img);

    // Nombre del producto
    const nombreProducto = document.createElement("div");
    nombreProducto.classList.add("nombre-producto");
    nombreProducto.textContent = producto.nombreArticulo;

    // Precio del producto
    const precioProducto = document.createElement("div");
    precioProducto.classList.add("precio-producto");

    // Verificar si el producto tiene descuento
    if (producto.descuentoArticulo && producto.descuentoArticulo > 0) {
        // Calcular el precio con descuento
        const precioConDescuento = (producto.precio * (1 - producto.descuentoArticulo)).toFixed(2);

        // Mostrar precio original tachado (antes de aplicar el descuento)
        const precioOriginal = document.createElement("span");
        precioOriginal.classList.add("precio-original");
        precioOriginal.textContent = `${producto.precio} KC`;
        precioOriginal.style.textDecoration = "line-through";
        precioProducto.appendChild(precioOriginal);
        precioProducto.innerHTML += "&nbsp;";

        // Mostrar el nuevo precio con descuento
        const nuevoPrecio = document.createElement("span");
        nuevoPrecio.classList.add("nuevo-precio");
        nuevoPrecio.textContent = `${precioConDescuento} KC`;
        precioProducto.appendChild(nuevoPrecio);
    } else {
        // Si no tiene descuento, solo mostrar el precio normal
        precioProducto.textContent = `${producto.precio} KC`;
    }

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
    cargarOfertasActuales();
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
            // Incrementamos el contador del carrito
            let contadorCarrito = parseInt(document.getElementById('contador-carrito').textContent) || 0;
            contadorCarrito += 1;
            document.getElementById('contador-carrito').textContent = contadorCarrito;
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