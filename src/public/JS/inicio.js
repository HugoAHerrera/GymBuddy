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

