function acceptChallenge(card) {
    card.classList.add('flipped');

    // Simulación de actualización de progreso
    let progress = 0;
    const progressBar = card.querySelector('.progress');
    const progressText = card.querySelector('.progress-text');

    const progressInterval = setInterval(() => {
        if (progress >= 100) {
            clearInterval(progressInterval);
            progressText.textContent = '¡Desafío completado!';
        } else {
            progress += 10;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `Progreso: ${progress}%`;
        }
    }, 1000); // Incrementa el progreso cada segundo
}
