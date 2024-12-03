// `guia_ejercicios.js`
document.addEventListener('DOMContentLoaded', async () => {
    const cargarEjercicios = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/ejercicios');
            if (!response.ok) throw new Error('Error al obtener los ejercicios');
            const ejercicios = await response.json();

            const galeria = document.getElementById('galeria-ejercicios');
            galeria.innerHTML = ''; // Limpiar contenido previo

            ejercicios.forEach(ejercicio => {
                const contenedor = document.createElement('div');
                contenedor.classList.add('contenedor');
                contenedor.innerHTML = `
                    <h1>${ejercicio.nombre_ejercicio}</h1>
                    <img src="${ejercicio.imagen}" alt="${ejercicio.nombre_ejercicio}" width="256" height="256">
                    <div class="info">
                        <div class="info-item">
                            <strong>Zona Principal</strong><br>
                            <p>${ejercicio.zona_principal}</p>
                        </div>
                        <div class="info-item">
                            <strong>Equipo Necesario</strong><br>
                            <p>${ejercicio.equipo_necesario}</p>
                        </div>
                        <div class="info-item">
                            <strong>Dificultad de la técnica del Ejercicio</strong><br>
                            <p>${ejercicio.dificultad}</p>
                        </div>
                        <div class="info-item">
                            <strong>Objetivo</strong><br>
                            <p>${ejercicio.objetivo}</p>
                        </div>
                    </div>
                    <div id="preparacion">
                        <h3>Preparación</h3>
                        <hr class="linea">
                        <p>${ejercicio.preparacion}</p>
                    </div>
                    <div id="ejecucion">
                        <h3> Ejecución </h3>
                        <hr class="linea">
                        <ol>
                            ${ejercicio.ejecucion.split('\n').map(paso => `<li>${paso}</li>`).join('')}
                        </ol>
                    </div>
                    <div id="consejos">
                        <h3> Consejos Clave </h3>
                        <hr class="linea">
                        <ol>
                            ${ejercicio.consejos_clave.split('\n').map(consejo => `<li>${consejo}</li>`).join('')}
                        </ol>
                    </div>
                `;
                galeria.appendChild(contenedor);
            });
        } catch (error) {
            console.error('Error:', error);
            const galeria = document.getElementById('galeria-ejercicios');
            galeria.innerHTML = '<p>Error al cargar los ejercicios.</p>';
        }
    };

    await cargarEjercicios();
});
