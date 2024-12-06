async function actualizarCarrito() {
    try {
        const response = await fetch('/api/obtenerCarro'); // Ya no es necesario pasar el id_usuario en la URL
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
        } else {
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



document.addEventListener('DOMContentLoaded', function () {
    const payButton = document.querySelector('.checkout-btn');
    const customAlert = document.getElementById('custom-alert');
    const seguirComprandoButton = document.getElementById('seguir-comprando');
    const procederPagoButton = document.getElementById('proceder-pago');

    payButton.addEventListener('click', function () {
        customAlert.style.display = 'block';
    });

    seguirComprandoButton.addEventListener('click', function () {
        window.location.href = 'tienda.html';
    });

    procederPagoButton.addEventListener('click', function () {
        window.location.href = 'pagar.html';
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