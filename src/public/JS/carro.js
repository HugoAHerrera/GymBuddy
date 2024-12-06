async function actualizarCarrito() {
    try {
        const response = await fetch('/api/obtenerCarro');
        console.log('Respuesta de la API:', response); // Verificar la respuesta completa de la API

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        const productos = await response.json();
        console.log('Productos recibidos desde la API:', productos); // Verificar los productos recibidos

        // Obtener el contenedor de productos (el div con la clase 'producto')
        const contenedorProducto = document.querySelector('.producto');
        contenedorProducto.innerHTML = ''; // Limpiar el contenido actual

        // Verificar si productos está vacío o no
        if (productos.length === 0) {
            console.log('El carrito está vacío');
            contenedorProducto.innerHTML = `<p>No tienes ningún producto en el carrito.</p>`;  // Mensaje de carrito vacío

            // Deshabilitar el botón de pago
            const procederPagoBtn = document.getElementById('proceder-pago');
            if (procederPagoBtn) {
                procederPagoBtn.disabled = true;  // Deshabilitar el botón de pago si no hay productos
            }

        } else {
            // Habilitar el botón de pago
            const procederPagoBtn = document.getElementById('proceder-pago');
            if (procederPagoBtn) {
                procederPagoBtn.disabled = false;  // Habilitar el botón de pago si hay productos
            }

            productos.forEach(producto => {
                const precioConDescuento = producto.precio * (1 - producto.descuentoArticulo); // Calculamos el precio con descuento
                contenedorProducto.innerHTML += `
                <div class="producto">
                    <img src="${producto.imagenArticulo}" alt="Imagen de: ${producto.nombreArticulo}">
                    <h2>${producto.nombreArticulo}</h2>
                    <p class="precio">Precio: $${producto.precio.toFixed(2)}</p>
                    <p class="precioDescuento">Precio con descuento: $${precioConDescuento.toFixed(2)}</p>
                    <p class="descripcion">Descuento: ${producto.descuentoArticulo}%</p>
                </div>
                `;
            });
        }
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
    }
}

// Llamar a la función cuando la página cargue
document.addEventListener('DOMContentLoaded', actualizarCarrito);


// Mostrar la alerta cuando se hace clic en el botón "Pagar"
document.querySelector('.checkout-btn').addEventListener('click', function() {
    // Mostrar la alerta de confirmación
    document.getElementById('custom-alert').style.display = 'block';
});

// Si el usuario elige "Seguir Comprando"
document.getElementById('seguir-comprando').addEventListener('click', function() {
    // Cerrar la alerta y redirigir al usuario a la tienda
    document.getElementById('custom-alert').style.display = 'none';
    window.location.href = 'tienda';  // Cambia esto a la URL correcta de la tienda
});

document.getElementById('proceder-pago').addEventListener('click', async function() {
    // Comprobar si el carrito está vacío antes de proceder
    const contenedorProducto = document.querySelector('.producto');
    const productos = contenedorProducto.querySelectorAll('.producto');

    if (productos.length === 0) {
        alert('No tienes ningún producto en el carrito para proceder al pago.');
        return;  // Detener la acción si no hay productos en el carrito
    }

    // Si el carrito tiene productos, proceder con la eliminación y la redirección
    const response = await fetch('/api/vacioCarro', { method: 'DELETE' });

    if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
    }

    // Cierra la alerta personalizada
    document.getElementById('custom-alert').style.display = 'none';
    // Redirige a la página de pago
    window.location.href = 'pagar';
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
