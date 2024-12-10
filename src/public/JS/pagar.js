document.addEventListener('DOMContentLoaded', function () {
    const payButton = document.getElementById('pay-button');

    payButton.addEventListener('click', async function () {
        const cardNumber = document.getElementById('card-number').value.trim();
        const expirationDate = document.getElementById('expiration-date').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        // Validación básica
        if (!cardNumber || !expirationDate || !cvv) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, complete todos los campos de la tarjeta.',
            });
            return;
        }

        // Confirmación
        const confirmation = await Swal.fire({
            title: '¿Desea guardar estos datos?',
            text: "Asegúrese de que los datos ingresados son correctos.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar',
        });

        if (!confirmation.isConfirmed) {
            // Paso 2: Vaciar el carrito después de crear el pedido
            await fetch('/api/vacioCarro', { method: 'DELETE' });
            window.location.href = '/obtenerProducto';
            return;
        }

        // Guardar datos
        payButton.disabled = true; // Evita clics repetidos
        try {
            const response = await fetch('/api/guardarDatosTarjeta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    numero_tarjeta: cardNumber,
                    fecha_caducidad: expirationDate,
                    CVV: cvv
                })
            });

            const data = await response.json();
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Datos guardados correctamente.',
                });
                // Paso 2: Vaciar el carrito después de crear el pedido
                await fetch('/api/vacioCarro', { method: 'DELETE' });
                window.location.href = '/obtenerProducto';
            } else {
                console.error(data.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message,
                });
            }
        } catch (error) {
            console.error('Error al guardar los datos de la tarjeta:', error);
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'Hubo un problema al guardar los datos.',
            });
        } finally {
            payButton.disabled = false; // Rehabilita el botón
        }
    });
});


async function actualizarCarrito() {
    try {
        // Solicitud a la API para obtener los productos en el carrito
        const response = await fetch('/api/obtenerCarro');

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        const productos = await response.json();

        // Referencia al contenedor del resumen del carrito
        const resumenCarrito = document.getElementById('cart-summary');
        const ul = resumenCarrito.querySelector('ul'); // Obtener la lista de productos
        ul.innerHTML = ''; // Limpiar el contenido actual de la lista
        let total = 0; // Inicializar el total

        if (productos.length === 0) {
            ul.innerHTML = `<li>No tienes ningún producto en el carrito.</li>`; // Mensaje de carrito vacío

            // Deshabilitar el botón de pago
            const payButton = document.getElementById('pay-button');
            if (payButton) {
                payButton.disabled = true;
            }
        } else {
            // Habilitar el botón de pago
            const payButton = document.getElementById('pay-button');
            if (payButton) {
                payButton.disabled = false;
            }

            // Agregar productos a la lista
            productos.forEach((producto) => {
                const precioConDescuento = producto.precio * (1 - producto.descuentoArticulo); // Calcular precio con descuento
                const subtotal = precioConDescuento * producto.cantidad; // Multiplicar por la cantidad
                total += subtotal; // Sumar al total

                const li = document.createElement('li'); // Crear un elemento de lista
                li.textContent = `${producto.nombreArticulo} x ${producto.cantidad}: ${subtotal.toFixed(2)} KC`;
                ul.appendChild(li); // Agregar el producto a la lista
            });

            // Agregar el total al final de la lista
            const liTotal = document.createElement('li');
            liTotal.innerHTML = `<strong>Total:</strong> ${total.toFixed(2)} KC`;
            ul.appendChild(liTotal);
        }
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
    }
}




document.addEventListener('DOMContentLoaded', function() {
    const logoImage = document.getElementById('logotype');
    actualizarCarrito()
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