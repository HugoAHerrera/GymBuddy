let currentSlide = 0;
const slides = [
  "Evento 1",
  "Evento 2",
  "Evento 3",
  "Evento 4",
  "Aquí están los eventos que cambian cada 3s",
];

function updateSlider() {
  const slideElement = document.querySelector(".event-slider .slide p");
  slideElement.textContent = slides[currentSlide];
  currentSlide = (currentSlide + 1) % slides.length;
}

setInterval(updateSlider, 3000); // Cambia cada 3 segundos

