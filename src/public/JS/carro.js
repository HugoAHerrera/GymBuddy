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