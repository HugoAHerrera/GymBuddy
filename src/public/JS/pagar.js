document.addEventListener('DOMContentLoaded', function () {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const payButton = document.getElementById('pay-button');

    paymentMethods.forEach(method => {
        method.addEventListener('click', function () {
            paymentMethods.forEach(m => m.classList.remove('expanded'));
            this.classList.add('expanded');
        });
    });

    payButton.addEventListener('click', function () {
        const selectedMethod = Array.from(paymentMethods).find(method => method.classList.contains('expanded'));
        if (!selectedMethod) {
            alert('Por favor, selecciona un método de pago.');
            return;
        }

        const inputs = selectedMethod.querySelectorAll('input');
        for (let input of inputs) {
            if (!input.value) {
                alert(`Por favor, rellena el campo: ${input.placeholder}`);
                return;
            }
        }

        alert('Procesando pago...');
        setTimeout(() => {
            window.location.href = 'obtener_producto.html';
        }, 2000);
    });
});