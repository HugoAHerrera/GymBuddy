document.addEventListener('DOMContentLoaded', function () {
    const payButton = document.getElementById('pay-button');

    payButton.addEventListener('click', async function () {
        const cardNumber = document.getElementById('card-number').value.trim();
        const expirationDate = document.getElementById('expiration-date').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        // Validación básica
        if (!cardNumber || !expirationDate || !cvv) {
            alert('Por favor, complete todos los campos de la tarjeta.');
            return;
        }

        /*
        // Validación del número de tarjeta (Algoritmo de Luhn)
        if (!isValidCardNumber(cardNumber)) {
            alert('Número de tarjeta inválido.');
            return;
        }
        */
        // Confirmación
        const confirmation = confirm('¿Desea guardar estos datos?');
        if (!confirmation) {
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
                alert('Datos guardados correctamente.');
                window.location.href = '/obtenerProducto';
            } else {
                console.error(data.message);
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error al guardar los datos de la tarjeta:', error);
            alert('Hubo un error al guardar los datos.');
        } finally {
            payButton.disabled = false; // Rehabilita el botón
        }
    });
/*
    // Valida un número de tarjeta con el Algoritmo de Luhn
    function isValidCardNumber(number) {
        let sum = 0;
        let shouldDouble = false;

        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number[i], 10);

            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }

        return sum % 10 === 0;
    }

 */
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