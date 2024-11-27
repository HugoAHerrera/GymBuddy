document.addEventListener('DOMContentLoaded', function () {
    const payButton = document.getElementById('pay-button');

    payButton.addEventListener('click', function () {
        window.location.href = 'obtener_producto.html';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const logoImage = document.getElementById('logotype');
    
    logoImage.addEventListener('click', function() {
        window.location.href = 'perfil.html';
    });
  });