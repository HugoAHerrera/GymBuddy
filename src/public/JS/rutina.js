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
    
                if (rutina.categoria === "Tus rutinas creadas") {
                    const editDiv = document.createElement('div');
                    editDiv.style.width = '20px';
                    editDiv.style.height = '100%';
                    editDiv.style.position = 'relative';
                    editDiv.style.marginLeft = "20px";
                    editDiv.style.backgroundColor = "white";
                    editDiv.style.borderRadius = '5px';
                    editDiv.style.overflow = 'hidden';
                    editDiv.style.cursor = 'pointer';

                    const editImage = document.createElement('img');
                    editImage.src = "../Imagenes/editar.png";
                    editImage.alt = "Editar rutina";
                    editImage.style.width = '100%';
                    editImage.style.height = '100%';
                    editImage.style.objectFit = 'contain'; 
    
                    editDiv.appendChild(editImage);
                    div.appendChild(editDiv);

                    editDiv.addEventListener('click', (e) => {
                        const rutinaDiv = e.currentTarget.closest('.rutina');
                        if (!rutinaDiv) return;
                        const rutinaNombre = rutinaDiv.childNodes[0].textContent.trim();
                        window.open(`/editar-rutina?id=${encodeURIComponent(rutinaNombre)}`, '_blank');
                    });
                }
    
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
            const rutinaNombre = event.target.textContent;
            window.open(`/rutina-concreta?id=${rutinaNombre}`, '_blank');
        }
    });

    const logoImage = document.getElementById('logotype');
    if (logoImage) {
        logoImage.addEventListener('click', () => {
            window.location.href = 'perfil.html';
        });
    }
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