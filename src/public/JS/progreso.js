
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

    // Redibujar el gráfico después de cambiar el tamaño
    const chartCanvas = selectedChart.querySelector('canvas');
    const chartInstance = Chart.getChart(chartCanvas);
    if (chartInstance) {
        chartInstance.resize();
    }
}

// Función para obtener los datos desde el backend
async function obtenerDatosSesiones() {
    try {
        const response = await fetch('/api/sesiones'); // Asegúrate de que esta URL sea la correcta
        const data = await response.json();

        // Transformar la data en arrays para las gráficas
        const sesiones = transformarDatosParaGraficas(data);

        // Ahora puedes usar estos arrays en tu lógica de gráficos
        console.log(sesiones);

        // Aquí podrías invocar una función para actualizar las gráficas con los datos
        actualizarGraficas(sesiones);

    } catch (error) {
        console.error('Error al obtener los datos de sesiones:', error);
    }
}

// Función para transformar los datos en arrays
function transformarDatosParaGraficas(data) {
    const tiempoEjecucion = [];
    const repeticiones = [];
    const sets = [];
    const kilometros = [];
    const kg = [];
    const fechas = [];

    data.forEach(sesion => {
        tiempoEjecucion.push(sesion.tiempo); // Guardar en minutos
        repeticiones.push(sesion.repeticiones);
        sets.push(sesion.sets);
        kilometros.push(sesion.kilometros);
        kg.push(sesion.kg);
        fechas.push(sesion.fecha);
    });

    return {
        tiempoEjecucion,
        repeticiones,
        sets,
        kilometros,
        kg,
        fechas
    };
}

// Función para actualizar las gráficas
function actualizarGraficas(sesiones) {
    const ctxDistanciaMaxima = document.getElementById('chart-distancia-maxima').getContext('2d');
    const ctxPesoMaximo = document.getElementById('chart-peso-maximo').getContext('2d');
    const ctxDuracionSesion = document.getElementById('chart-duracion-sesion').getContext('2d');

    // Inicialización de gráficos vacíos por defecto
    new Chart(ctxDistanciaMaxima, {
        type: 'line',
        data: {
            labels: sesiones.fechas,
            datasets: [{
                label: 'Distancia Maxima (km)',
                data: sesiones.kilometros,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    new Chart(ctxPesoMaximo, {
        type: 'line',
        data: {
            labels: sesiones.fechas,
            datasets: [{
                label: 'Peso Maximo (kg)',
                data: sesiones.kg,
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    new Chart(ctxDuracionSesion, {
        type: 'line',
        data: {
            labels: sesiones.fechas,
            datasets: [{
                label: 'Duración de Sesión (min)',
                data: sesiones.tiempoEjecucion,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Llamar a la función para obtener los datos de las sesiones y actualizar las gráficas
    obtenerDatosSesiones();

    const logoImage = document.getElementById('logotype');
    logoImage.addEventListener('click', function() {
        window.location.href = 'perfil.html';
    });
});



/*
function filterData(period) {
    let labels, dataDistanciaMaxima, dataPesoMaximo, dataDuracionSesion;

    switch (period) {
        case 'semana':
            labels = ['07/10/24', '08/10/24', '09/10/24', '10/10/24', '11/10/24', '12/10/24', '13/10/24'];
            dataDistanciaMaxima = [5, 10, 7, 8, 6, 9, 11];
            dataPesoMaximo = [50, 55, 60, 65, 70, 75, 80];
            dataDuracionSesion = [30, 45, 40, 50, 60, 55, 70];
            break;
        case 'mes':
            labels = ['01/10/24', '08/10/24', '15/10/24', '22/10/24', '29/10/24'];
            dataDistanciaMaxima = [50, 60, 55, 65, 70];
            dataPesoMaximo = [100, 110, 105, 115, 120];
            dataDuracionSesion = [300, 350, 320, 370, 400];
            break;
        case 'año':
            labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            dataDistanciaMaxima = [200, 220, 210, 230, 240, 250, 260, 270, 280, 290, 300, 310];
            dataPesoMaximo = [200, 220, 210, 230, 240, 250, 260, 270, 280, 290, 300, 310];
            dataDuracionSesion = [600, 650, 620, 670, 700, 750, 720, 770, 800, 850, 820, 870];
            break;
        case 'total':
            labels = ['2020', '2021', '2022', '2023', '2024'];
            dataDistanciaMaxima = [1000, 1100, 1050, 1150, 1200];
            dataPesoMaximo = [500, 550, 525, 575, 600];
            dataDuracionSesion = [3000, 3500, 3200, 3700, 4000];
            break;
    }

    updateChart(chartDistanciaMaxima, labels, dataDistanciaMaxima);
    updateChart(chartPesoMaximo, labels, dataPesoMaximo);
    updateChart(chartDuracionSesion, labels, dataDuracionSesion);
}
*/