let chartTiempo = null;
let chartRutinas = null;

function expandChart(chartId) {
    const charts = document.querySelectorAll('.chart-section');
    charts.forEach(chart => {
        if (chart.id !== chartId) {
            chart.style.height = "150px";
        }
    });
    const selectedChart = document.getElementById(chartId);
    if (selectedChart.style.height === "300px") {
        selectedChart.style.height = "150px";
    } else {
        selectedChart.style.height = "300px";
    }
}

// Función para obtener los datos desde el backend
async function obtenerDatosSesiones() {
    try {
        const response = await fetch('/api/sesiones');
        const data = await response.json();
        console.log('Datos de sesiones:', data);
        const sesiones = transformarDatosParaGraficas(data);
        actualizarGraficas(sesiones);
    } catch (error) {
        console.error('Error al obtener los datos de sesiones:', error);
    }
}

async function obtenerRutinasHechas(){
    try {
        const response = await fetch('/api/rutinasHechas');
        const data = await response.json();
        console.log('Rutinas hechas:', data);
        const sesiones = transformarDatosParaGraficas(data);
        actualizarGraficas(sesiones);
    } catch (error) {
        console.error('Error al obtener las rutinas:', error);
    }
}


async function obtenerEstadisticas() {
    try {
        const response = await fetch(`/api/estadisticas`);
        const data = await response.json();
        const sesionesCompletadas = data.sesionesCompletadas || 0;
        const distanciaRecorrida = data.distanciaRecorrida || 0;
        const ultimaSesion = data.ultimaSesion || 'Nunca';
        // Actualizar el DOM con los datos
        document.getElementById('sesiones-completadas').innerText = sesionesCompletadas;
        document.getElementById('distancia-recorrida').innerText = distanciaRecorrida.toFixed(1); // Para un decimal
        document.getElementById('ultima-sesion').innerText = dayjs(ultimaSesion).format('DD-MM-YYYY');
    } catch (error) {
        console.error('Error al obtener estadísticas del usuario:', error);
    }
}

function transformarDatosParaGraficas(data) {
    const tiempoRutina = [];
    const fechas = [];
    const nombresRutina = []; // Nueva variable para almacenar los nombres de las rutinas
    const cantidades = []; // Nueva variable para almacenar la cantidad de veces que se hizo cada rutina

    data.forEach(sesion => {
        tiempoRutina.push(sesion.tiempo_total); // Cambiado a "tiempoTotal"
        const fechaFormateada = dayjs(sesion.fecha).format('DD-MM-YYYY');
        fechas.push(fechaFormateada);
        nombresRutina.push(sesion.nombre_rutina); // Almacena el nombre de la rutina
        cantidades.push(sesion.total_rutina); // Almacena la cantidad de veces que se hizo
    });
    console.log('Tiempo de rutina:', tiempoRutina);
    console.log('Fechas:', fechas);
    console.log('Nombres de rutina:', nombresRutina);
    console.log('Cantidades:', cantidades);

    return {
        tiempoRutina,
        fechas,
        nombresRutina, // Devuelve los nombres de las rutinas
        cantidades // Devuelve las cantidades
    };
}

function actualizarGraficas(sesiones) {
    const ctxTiempo = document.getElementById('chart-tiempo').getContext('2d');
    const ctxRutinas = document.getElementById('chart-rutinas').getContext('2d');

    // Si los gráficos ya existen, simplemente actualízalos
    if (chartTiempo) {
        chartTiempo.data.labels = sesiones.fechas;
        chartTiempo.data.datasets[0].data = sesiones.tiempoRutina;
        chartTiempo.update(); // Actualiza el gráfico
    } else {
        // Gráfico de barras: Tiempo por sesión
        chartTiempo = new Chart(ctxTiempo, {
            type: 'bar',
            data: {
                labels: sesiones.fechas,
                datasets: [{
                    label: 'Tiempo de Rutina (min)',
                    data: sesiones.tiempoRutina,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: Math.max(...sesiones.tiempoRutina) + 5,
                        stepSize: 10
                    }
                }
            }
        });
    }

    // Si el gráfico de rutinas ya existe, simplemente actualízalo
    if (chartRutinas) {
        chartRutinas.data.labels = sesiones.nombresRutina;
        chartRutinas.data.datasets[0].data = sesiones.cantidades;
        chartRutinas.update(); // Actualiza el gráfico
    } else {
        // Gráfico de pastel: Cantidad de rutinas
        chartRutinas = new Chart(ctxRutinas, {
            type: 'pie',
            data: {
                labels: sesiones.nombresRutina, // Nombres de las rutinas
                datasets: [{
                    label: 'Cantidad de Rutinas:',
                    data: sesiones.cantidades, // Cantidad de veces que se hizo cada rutina
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
            }
        });
    }
}




document.addEventListener('DOMContentLoaded', function () {
    // Llamar a la función para obtener los datos de las sesiones y actualizar las gráficas
    obtenerDatosSesiones();
    obtenerRutinasHechas();
    obtenerEstadisticas();
    const logoImage = document.getElementById('logotype');
    logoImage.addEventListener('click', function() {
        window.location.href = 'perfil.html';
    });
});

function updateChart(chart, labels, data) {
    chart.data.labels = labels; // Actualiza las etiquetas del gráfico
    chart.data.datasets[0].data = data; // Actualiza los datos del primer dataset
    chart.update(); // Refresca el gráfico para mostrar los cambios
}

async function filterData(period) {
    try {
        const response = await fetch(`/api/sesiones?periodo=${period}`);
        const data = await response.json();
        // Si las fechas ya están formateadas y los valores están correctos, no se debe modificar nada
        updateChart(chartTiempo, data.map(row => dayjs(row.fecha).format('DD-MM-YYYY')), data.map(row => row.tiempo_total));
        updateChart(chartRutinas, data.map(row => row.nombre_rutina), data.map(row => row.total_rutina));
    } catch (error) {
        console.error('Error al filtrar datos:', error);
    }
}

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