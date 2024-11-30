let chartDistanciaMaxima;
let chartPesoMaximo;
let chartDuracionSesion;

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
        const response = await fetch('/api/sesiones'); // Asegúrate de que esta URL sea la correcta
        const data = await response.json();

        // Transformar la data en arrays para las gráficas
        const sesiones = transformarDatosParaGraficas(data);

        // Aquí podrías invocar una función para actualizar las gráficas con los datos
        actualizarGraficas(sesiones);

    } catch (error) {
        console.error('Error al obtener los datos de sesiones:', error);
    }
}

async function obtenerEstadisticas() {
    try {
        const response = await fetch(`/api/estadisticas/`);
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

        // Reemplazar comas por puntos y convertir a números
        kilometros.push(parseFloat(sesion.kilometros.toString().replace(',', '.')));
        kg.push(parseFloat(sesion.kg.toString().replace(',', '.')));

        // Reformatear las fechas con Day.js al formato 'DD-MM-YYYY'
        const fechaFormateada = dayjs(sesion.fecha).format('DD-MM-YYYY');
        fechas.push(fechaFormateada);
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

    // Inicializa los gráficos y guárdalos en las variables globales
    chartDistanciaMaxima = new Chart(ctxDistanciaMaxima, {
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
                    beginAtZero: true,
                    min: 0,
                    max: Math.max(...sesiones.kilometros) + 5,
                    stepSize: 2,
                    ticks: {
                        callback: function (value) {
                            return value.toFixed(1);
                        }
                    }
                }
            }
        }
    });

    chartPesoMaximo = new Chart(ctxPesoMaximo, {
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
                    beginAtZero: true,
                    min: 0,
                    max: Math.max(...sesiones.kg) + 5,
                    stepSize: 2,
                    ticks: {
                        callback: function (value) {
                            return value.toFixed(1);
                        }
                    }
                }
            }
        }
    });

}


document.addEventListener('DOMContentLoaded', function () {
    // Llamar a la función para obtener los datos de las sesiones y actualizar las gráficas
    obtenerDatosSesiones();
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
        updateChart(chartDistanciaMaxima, data.map(row => dayjs(row.fecha).format('DD-MM-YYYY')), data.map(row => row.kilometros));
        updateChart(chartPesoMaximo, data.map(row => dayjs(row.fecha).format('DD-MM-YYYY')), data.map(row => row.kg));
    } catch (error) {
        console.error('Error al filtrar datos:', error);
    }
}