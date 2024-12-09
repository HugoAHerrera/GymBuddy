async function cargarImagenUsuario() {
    try {

        // Hacer una solicitud al endpoint que devuelve la imagen
        const respuesta = await fetch('/api/blobAImagen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Para enviar cookies de sesión
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo cargar la imagen del usuario');
        }

        const datos = await respuesta.json();

        // Verificar si la API devuelve una imagen en Base64
        if (!datos.imagen) {
            console.error('No se recibió una imagen válida.');
            return;
        }

        // Si la imagen es Base64, asegurarse de que tiene el prefijo adecuado
        if (!datos.imagen.startsWith('data:image')) {
            console.error('La imagen no tiene el formato Base64 adecuado.');
            return;
        }

        // Asignar la imagen al elemento como fondo
        const imgElemento = document.getElementById('foto-perfil');
        imgElemento.style.backgroundImage = `url('${datos.imagen}')`;  // Establecer la imagen en formato Base64 como fondo

        // Opcionalmente, puedes ajustar otros estilos como el tamaño del fondo
        imgElemento.style.backgroundSize = 'cover';  // Ajusta el tamaño del fondo para cubrir el elemento
        imgElemento.style.backgroundPosition = 'center';  // Centra la imagen dentro del elemento


    } catch (error) {
        console.error('Error al cargar la imagen:', error);
    }
}

// Cargas iniciales
cargarImagenUsuario();
cargarCarritoDesdeServidor();

// Todo lo relacionado con el carrito del header
let contadorCarrito = 0;  // Número total de productos
let carrito = [];  // Lista de productos en el carrito

// Función para alternar la visibilidad del menú del carrito
function desplegarCarrito() {
    const menuCarrito = document.getElementById("menu-carrito");
    menuCarrito.style.display = menuCarrito.style.display === "block" ? "none" : "block";
}


// Función para cargar los productos del carrito desde el servidor
async function cargarCarritoDesdeServidor() {
    try {
        const respuesta = await fetch('/api/obtenerCarro', {
            method: 'GET',
            credentials: 'include',
        });

        if (!respuesta.ok) {
            throw new Error('Error al obtener productos del carrito');
        }

        const productos = await respuesta.json();

        // Actualizar el carrito con los productos obtenidos
        carrito = productos.map(producto => ({
            id: producto.idArticulo,
            nombre: producto.nombreArticulo,
            precio: producto.precio,
            descuento: producto.descuentoArticulo,
            cantidad: producto.cantidad
        }));

        // Actualizar el contador del carrito
        contadorCarrito = carrito.reduce((total, producto) => total + producto.cantidad, 0);
        document.getElementById("contador-carrito").textContent = contadorCarrito;
    } catch (error) {
        console.error('Error al cargar el carrito desde el servidor:', error);
    }
}

// Función para desplegar el carrito
async function desplegarCarrito() {
    const menuCarrito = document.getElementById("menu-carrito");
    const isCurrentlyVisible = menuCarrito.style.display === "block";

    if (!isCurrentlyVisible) {
        await cargarCarritoDesdeServidor();
        actualizarListaCarrito();
    }

    menuCarrito.style.display = isCurrentlyVisible ? "none" : "block";
}

// Función para actualizar la lista de artículos en el carrito
function actualizarListaCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        const mensajeVacio = document.createElement("li");
        mensajeVacio.textContent = "Tu carrito está vacío.";
        listaCarrito.appendChild(mensajeVacio);
    } else {
        const fragment = document.createDocumentFragment();

        carrito.forEach((producto) => {
            const itemCarrito = document.createElement("li");

            const detallesProducto = document.createElement("div");
            detallesProducto.textContent = `${producto.nombre} - ${producto.precio} KC (x${producto.cantidad})`;

            const idArticuloElemento = document.createElement("span");
            idArticuloElemento.classList.add("idArticulo");
            idArticuloElemento.style.display = "none";
            idArticuloElemento.textContent = producto.id;

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.className = "boton-eliminar";
            botonEliminar.onclick = () => {
                eliminarProductoDelCarrito(producto.id);
            };

            itemCarrito.appendChild(detallesProducto);
            itemCarrito.appendChild(idArticuloElemento);
            itemCarrito.appendChild(botonEliminar);

            fragment.appendChild(itemCarrito);
        });

        listaCarrito.appendChild(fragment);
    }
}

async function eliminarProductoDelCarrito(idArticulo) {
    try {
        // Encontrar el producto en el carrito utilizando el idArticulo
        const productoAEliminar = carrito.find(producto => producto.id === idArticulo);

        if (!productoAEliminar) {
            console.error('Producto no encontrado en el carrito');
            return;
        }

        console.log(`Producto encontrado: ${productoAEliminar.nombre}, ID: ${productoAEliminar.id}`);

        // Realizar solicitud al servidor para eliminar el producto
        const respuesta = await fetch('/api/eliminarDelCarro', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                idArticulo: productoAEliminar.id,
            }),
        });

        // Verificar si la respuesta es exitosa
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            console.error('Error al eliminar producto del carrito:', errorData);
            alert(errorData.message || 'No se pudo eliminar el producto. Intenta de nuevo más tarde.');
            return;
        }

        console.log(`Producto eliminado del carrito, ID: ${idArticulo}`);

        // Eliminar localmente si la solicitud fue exitosa
        carrito = carrito.filter(producto => producto.id !== idArticulo);

        // Recalcular el contador
        contadorCarrito = carrito.reduce((total, producto) => total + producto.cantidad, 0);
        document.getElementById("contador-carrito").textContent = contadorCarrito;

        // Actualizar la lista visible del carrito
        actualizarListaCarrito();
    } catch (error) {
        console.error('Error al intentar eliminar el producto del carrito:', error);
        alert('No se pudo eliminar el producto. Intenta de nuevo más tarde.');
    }
}

// Función para proceder a la compra
function procederCompra() {
    window.location.href = 'carro';
}

window.onclick = function(event) {
    const menuCarrito = document.getElementById("menu-carrito");
    if (!event.target.closest('#carrito') && menuCarrito.style.display === "block") {
        menuCarrito.style.display = "none";
    }
};