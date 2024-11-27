document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    document.getElementById("response-message").textContent = `Gracias, ${name}. Hemos recibido tu mensaje.`;
});

document.addEventListener('DOMContentLoaded', function() {
    const logoImage = document.getElementById('logotype');
    
    logoImage.addEventListener('click', function() {
        window.location.href = 'perfil.html';
    });
  });