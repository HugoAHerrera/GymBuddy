document.addEventListener('DOMContentLoaded', function () {
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const productosRelacionados = document.querySelector('.productos-relacionados');

    leftArrow.addEventListener('click', function () {
        productosRelacionados.scrollBy({
            left: -200,
            behavior: 'smooth'
        });
    });

    rightArrow.addEventListener('click', function () {
        productosRelacionados.scrollBy({
            left: 200,
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const pagarButton = document.querySelector('.checkout-btn');
    const confirmarPagoButton = document.getElementById('confirmarPago');

    pagarButton.addEventListener('click', function () {
        $('#pagarModal').modal('show');
    });

    confirmarPagoButton.addEventListener('click', function () {
        window.location.href = 'pagar.html';
    });
});