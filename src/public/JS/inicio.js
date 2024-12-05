// Rotación de ofertas mejorada con animación de opacidad
let currentSlide = 0;

const slides = [
    "Oferta 1: Descuento del 20% en todos los productos de la tienda",
    "Oferta 2: 2x1 en clases de entrenamiento personal",
    "Oferta 3: Envío gratis en compras de más de $50"
];

const slider = document.querySelector('.offers-slider .slides');
const slideText = slider.querySelector('p');

function rotateSlides() {
    slideText.textContent = slides[currentSlide];
    slider.classList.remove('active');
    setTimeout(() => {
        slider.classList.add('active');
        currentSlide = (currentSlide + 1) % slides.length;
    }, 100);
}

setInterval(rotateSlides, 4000); // Cambia las ofertas cada 4 segundos

// Iniciar la primera diapositiva
rotateSlides();

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtén la imagen por su id
    const logoImage = document.getElementById('logotype');
    
    // Agrega un listener para el evento de clic
    logoImage.addEventListener('click', function() {
        // Redirige al usuario a la página perfil.html
        window.location.href = 'perfil.html';
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
.then(response => response.text())
.then(data => document.getElementById('header-container').innerHTML = data);

fetch('../HTML/footer.html')
.then(response => response.text())
.then(data => document.getElementById('footer-container').innerHTML = data);