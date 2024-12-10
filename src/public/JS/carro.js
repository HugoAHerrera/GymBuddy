async function actualizarCarrito() {
    try {
        const response = await fetch('/api/obtenerCarro');
        //console.log('Respuesta de la API:', response); // Verificar la respuesta completa de la API

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        const productos = await response.json();
        //console.log('Productos recibidos desde la API:', productos); // Verificar los productos recibidos

        // Obtener el contenedor de productos (el div con la clase 'producto')
        const contenedorProducto = document.querySelector('.producto');
        contenedorProducto.innerHTML = ''; // Limpiar el contenido actual

        // Verificar si productos está vacío o no
        if (productos.length === 0) {
            //console.log('El carrito está vacío');
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
                const descuentoPorcentaje = producto.descuentoArticulo * 100; // Convertir el descuento a porcentaje

                // Convertir el Buffer en Blob y luego en URL
                const byteArray = new Uint8Array(producto.imagenArticulo.data); // Crear un array de bytes
                const blob = new Blob([byteArray], { type: 'image/png' }); // Crear un Blob con el tipo MIME correcto
                const imagenURL = URL.createObjectURL(blob); // Crear una URL de objeto para la imagen

                // Añadir el producto al contenedor
                contenedorProducto.innerHTML += `
                <div class="producto">
                    <img src="${imagenURL}" alt="Imagen de: ${producto.nombreArticulo}">
                    <h2>${producto.nombreArticulo}</h2>
                    <p class="precio">Precio: ${producto.precio.toFixed(2)} KC</p>
                    <p class="precioDescuento">Precio con descuento: ${precioConDescuento.toFixed(2)} KC</p>
                    <p class="descripcion">Descuento: ${descuentoPorcentaje.toFixed(2)} %</p>
                    <p class="cantidad">Cantidad: ${producto.cantidad}</p>
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

document.getElementById('proceder-pago').addEventListener('click', async function () {
    try {
        const contenedorProducto = document.querySelector('.producto');
        const productos = contenedorProducto.querySelectorAll('.producto');

        if (productos.length === 0) {
            mostrarAlerta('No tienes ningún producto en el carrito para proceder al pago.', 'error');
            return;
        }

        const response = await fetch('/api/pasarAPedido', { method: 'POST' });

        if (!response.ok) {
            throw new Error(`Error al procesar el pedido: ${response.status} ${response.statusText}`);
        }

        mostrarAlerta('Pedido realizado correctamente. Redirigiendo al pago...', 'success');
        setTimeout(() => {
            window.location.href = '/pagar';
        }, 3000); // Redirige después de 3 segundos
    } catch (err) {
        console.error(err);
        mostrarAlerta(`Hubo un problema: ${err.message}`, 'error');
    }
});

// Función para mostrar alertas personalizadas
function mostrarAlerta(mensaje, tipo) {
    const alerta = document.createElement('div');
    alerta.className = `alert ${tipo}`;
    alerta.innerHTML = `
        <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
        ${mensaje}
    `;
    document.body.appendChild(alerta);

    setTimeout(() => {
        alerta.style.display = 'none';
    }, 5000); // Desaparece después de 5 segundos
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
