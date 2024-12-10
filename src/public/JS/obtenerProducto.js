document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Realizamos la solicitud a la API sin incluir el ID del usuario
        const response = await fetch('/api/obtenerProductos');
        if (!response.ok) {
            throw new Error(`Error al obtener productos: ${response.status} ${response.statusText}`);
        }

        // Parseamos la respuesta en JSON
        const productos = await response.json();

        // Limpiamos el contenido previo y agregamos los productos
        const contenedorProductos = document.querySelector('.productos');
        contenedorProductos.innerHTML = '<h2>Productos Comprados:</h2>'; // Título principal
        const ul = document.createElement('ul'); // Crear una lista para mostrar los productos

        productos.forEach((producto) => {
            const precioFinal = producto.precio * (1 - producto.descuento);
            const precioxcantidad = precioFinal * producto.cantidad; // Multiplicar por la cantidad

            // Crear un elemento de lista para cada producto
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${producto.nombreProducto}</strong> - 
                Precio original: ${producto.precio.toFixed(2)} KC
                ${producto.descuento > 0 ? `(Descuento: ${(producto.descuento * 100).toFixed(0)}%)` : ''}
                <br>
                <strong>Cantidad:</strong> ${producto.cantidad}
                <strong>Precio final:</strong> ${precioxcantidad.toFixed(2)} KC
            `;
            ul.appendChild(li);
        });

        contenedorProductos.appendChild(ul); // Insertamos la lista en el contenedor
    } catch (error) {
        console.error(error);
    }
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