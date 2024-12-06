// Función para completar el desafío con efectos
function completeChallenge(card, reward) {
    card.classList.add("completed");
    showFireworks();
    showRewardMessage(reward);
}

// Función para mostrar los fuegos artificiales
function showFireworks() {
    const fireworksContainer = document.getElementById("fireworks-container");
    fireworksContainer.style.display = "block";

    // Crear efectos de fuegos artificiales (incrementamos el número de fuegos)
    for (let i = 0; i < 50; i++) {  // Incrementamos a 50 fuegos artificiales
        const firework = document.createElement("div");
        firework.className = "firework";
        firework.style.left = `${Math.random() * 100}%`;
        firework.style.top = `${Math.random() * 100}%`;
        fireworksContainer.appendChild(firework);

        setTimeout(() => firework.remove(), 4000); // Hacemos que los fuegos duren 4 segundos
    }

    // Ocultar contenedor de fuegos artificiales después de 4 segundos
    setTimeout(() => {
        fireworksContainer.style.display = "none";
    }, 4000);
}

// Función para mostrar el mensaje de recompensa
function showRewardMessage(reward) {
    const rewardMessage = document.getElementById("reward-message");
    rewardMessage.textContent = `¡Has ganado: ${reward}! 🎉`;
    rewardMessage.classList.remove("hidden");

    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        rewardMessage.classList.add("hidden");
    }, 3000);
}

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