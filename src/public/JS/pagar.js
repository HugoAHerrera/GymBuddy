document.addEventListener('DOMContentLoaded', function () {
    const payButton = document.getElementById('pay-button');

    payButton.addEventListener('click', function () {
        // Obtener los valores de los campos de la tarjeta
        const cardNumber = document.getElementById('card-number').value;
        const expirationDate = document.getElementById('expiration-date').value;
        const cvv = document.getElementById('cvv').value;

        // Validar que todos los campos estén llenos
        if (!cardNumber || !expirationDate || !cvv) {
            alert('Por favor, complete todos los campos de la tarjeta.');
            return;
        }

        // Mostrar la alerta
        const confirmation = confirm('¿Desea guardar estos datos?');

        if (confirmation) {
            // Si el usuario acepta, guardamos los datos en la base de datos
            fetch('/api/guardarDatosTarjeta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    numero_tarjeta: cardNumber,
                    fecha_caducidad: expirationDate,
                    CVV: cvv
                })
            })
                .then(response => response.json())
                .then(data => {
                    // Si la respuesta es exitosa, redirigir a obtenerProducto.html
                    window.location.href = 'obtenerProducto.html';
                })
                .catch(error => {
                    console.error('Error al guardar los datos de la tarjeta:', error);
                    alert('Hubo un error al guardar los datos.');
                });
        } else {
            // Si el usuario no acepta, simplemente redirigimos a obtenerProducto.html
            window.location.href = 'obtener^Producto.html';
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const logoImage = document.getElementById('logotype');
    
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