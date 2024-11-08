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