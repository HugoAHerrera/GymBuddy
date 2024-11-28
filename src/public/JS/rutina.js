document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/rutinas');
        const rutinas = await response.json();

        const categoriasMap = {
            "Para ti": document.querySelector('.recomendaciones-container'),
            "Entrenamientos rápidos": document.querySelector('.rutinas-container[data-categoria="Entrenamientos rápidos"]'),
            "Desafíos": document.querySelector('.rutinas-container[data-categoria="Desafíos"]'),
            "Pierna": document.querySelector('.rutinas-container[data-categoria="Pierna"]'),
            "Hombro": document.querySelector('.rutinas-container[data-categoria="Hombro"]'),
            "Abdomen": document.querySelector('.rutinas-container[data-categoria="Abdomen"]'),
            "Material": document.querySelector('.rutinas-container[data-categoria="Material"]'),
            "Tus rutinas creadas": document.querySelector('.rutinas-container[data-categoria="Tus rutinas creadas"]'),
        };

        rutinas.forEach(rutina => {
            const container = categoriasMap[rutina.categoria];

            if (container) {
                const div = document.createElement('div');
                div.classList.add(rutina.categoria === "Para ti" ? "recomendacion" : "rutina");
                div.textContent = rutina.nombre;
                container.appendChild(div);
            }
        });

        const tusRutinasContainer = categoriasMap["Tus rutinas creadas"];
        if (tusRutinasContainer && tusRutinasContainer.children.length === 0) {
            tusRutinasContainer.innerHTML = '<p>No hay rutinas creadas</p>';
        }
    } catch (error) {
        console.error('Error al cargar las rutinas:', error);
    }

    document.body.addEventListener('click', (event) => {
        if (event.target.matches('.recomendacion, .rutina')) {
            window.open('rutina_concreta.html', '_blank');
        }
    });

    const logoImage = document.getElementById('logotype');
    if (logoImage) {
        logoImage.addEventListener('click', () => {
            window.location.href = 'perfil.html';
        });
    }
});