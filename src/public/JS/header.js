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

// Ejecutar la función al cargar la página o en el momento adecuado
cargarImagenUsuario();



// Todo lo relacionado con el carrito del header
let contadorCarrito = 0;  // Número total de productos
let carrito = [];  // Lista de productos en el carrito

// Función para alternar la visibilidad del menú del carrito
function desplegarCarrito() {
    const menuCarrito = document.getElementById("menu-carrito");
    menuCarrito.style.display = menuCarrito.style.display === "block" ? "none" : "block";
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