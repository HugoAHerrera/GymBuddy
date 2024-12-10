let chartTiempo;
let chartRutinas;

function expandChart(chartId) {
    const charts = document.querySelectorAll('.chart-section');
    // Cerrar todos los gráficos antes de abrir el seleccionado
    charts.forEach(chart => {
        if (chart.id !== chartId) {
            chart.style.height = "150px";
        }
    });
    // Abrir o cerrar el gráfico seleccionado
    const selectedChart = document.getElementById(chartId);
    // Si el gráfico está abierto, ciérralo; si está cerrado, ábrelo
    if (selectedChart.style.height === "400px") {
        selectedChart.style.height = "200px";
    } else {
        selectedChart.style.height = "400px";
    }
}

// Función para obtener los datos de sesiones (Tiempo por sesión)
async function obtenerDatosSesiones() {
    try {
        const response = await fetch('/api/sesiones');
        const data = await response.json();
        const sesiones = transformarDatosParaGraficas(data);
        actualizarGraficoTiempo(sesiones);

    } catch (error) {
        console.error('Error al obtener los datos de sesiones:', error);
    }
}

// Función para obtener los datos de rutinas hechas
async function obtenerRutinasHechas() {
    try {
        const response = await fetch('/api/rutinasHechas');
        const datos = await response.json();
        const sesiones = transformarDatosParaGraficas(datos);
        actualizarGraficoRutinas(sesiones);
    } catch (error) {
        console.error('Error al obtener las rutinas:', error);
    }
}


async function obtenerEstadisticas() {
    try {
        const response = await fetch(`/api/estadisticas`);
        const data = await response.json();
        const sesionesCompletadas = data.sesionesCompletadas || 0;
        const distanciaRecorrida = data.distanciaRecorrida.toFixed(1) || 0;
        const ultimaSesion = dayjs(data.ultimaSesion).format('DD-MM-YYYY') || 'Nunca';

        // Actualizar el DOM con los datos
        document.getElementById('sesiones-completadas').innerText = sesionesCompletadas;
        document.getElementById('distancia-recorrida').innerText = distanciaRecorrida;
        document.getElementById('ultima-sesion').innerText = ultimaSesion;
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

    return {
        tiempoRutina,
        fechas,
        nombresRutina, // Devuelve los nombres de las rutinas
        cantidades // Devuelve las cantidades
    };
}

// Función para actualizar el gráfico de tiempo por sesión
function actualizarGraficoTiempo(sesiones) {
    const ctxTiempo = document.getElementById('chart-tiempo').getContext('2d');
    if (chartTiempo) {
        chartTiempo.data.labels = sesiones.fechas;
        chartTiempo.data.datasets[0].data = sesiones.tiempoRutina;
        chartTiempo.update();
    } else {
        chartTiempo = new Chart(ctxTiempo, {
            type: 'line',
            data: {
                labels: sesiones.fechas,
                datasets: [{
                    label: 'Tiempo de Sesión (sec)',
                    data: sesiones.tiempoRutina,
                    borderColor: 'rgba(75, 192, 192, 1)', // Color vibrante para la línea
                    borderWidth: 3,
                    tension: 0.4, // Para hacer la línea más suave
                    pointBackgroundColor: 'rgba(75, 192, 192, 0.8)', // Color de los puntos
                    pointRadius: 5, // Tamaño de los puntos
                    fill: true, // Rellenar bajo la línea
                    backgroundColor: 'rgba(75, 192, 192, 0.2)' // Degradado suave bajo la línea
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: Math.max(...sesiones.tiempoRutina) + 20,
                        stepSize: 20,
                        ticks: {
                            font: {
                                size: 14,
                                family: 'Arial, sans-serif'
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 14,
                                family: 'Arial, sans-serif'
                            }
                        }
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: {
                                size: 16
                            }
                        }
                    }
                },
                elements: {
                    line: {
                        borderWidth: 3
                    },
                    point: {
                        radius: 5,
                        hoverRadius: 8
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
}

// Función para actualizar el gráfico de rutinas
function actualizarGraficoRutinas(sesiones) {
    const ctxRutinas = document.getElementById('chart-rutinas').getContext('2d');
    if (chartRutinas) {
        chartRutinas.data.labels = sesiones.nombresRutina;
        chartRutinas.data.datasets[0].data = sesiones.cantidades;
        chartRutinas.update();
        chartRutinas.resize();  // Redimensiona el gráfico
    } else {
        chartRutinas = new Chart(ctxRutinas, {
            type: 'pie',
            data: {
                labels: sesiones.nombresRutina,
                datasets: [{
                    label: 'Cantidad de Rutinas',
                    data: sesiones.cantidades,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const label = tooltipItem.label || '';
                                const value = tooltipItem.raw || 0;
                                const total = tooltipItem.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                                const percentage = ((value / total) * 100).toFixed(2);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        chartRutinas.resize();  // Redimensiona el gráfico al crearlo
    }
}







document.addEventListener('DOMContentLoaded', function () {
    // Llamar a la función para obtener los datos de las sesiones y actualizar las gráficas
    obtenerDatosSesiones();
    obtenerRutinasHechas();
    obtenerEstadisticas();
});

function updateChart(chart, labels, data) {
    chart.data.labels = labels; // Actualiza las etiquetas del gráfico
    chart.data.datasets[0].data = data; // Actualiza los datos del primer dataset
    chart.update(); // Refresca el gráfico para mostrar los cambios
}

async function filterData(period) {
    try {
        // Llamada para obtener las sesiones
        const responseSesiones = await fetch(`/api/sesiones?periodo=${period}`);
        const dataSesiones = await responseSesiones.json();

        // Llamada para obtener las rutinas hechas
        const responseRutinas = await fetch(`/api/rutinasHechas?periodo=${period}`);
        const dataRutinas = await responseRutinas.json();

        // Actualiza el gráfico de Tiempo por sesión
        updateChart(chartTiempo,
            dataSesiones.map(row => dayjs(row.fecha).format('DD-MM-YYYY')),
            dataSesiones.map(row => row.tiempo_total)
        );

        // Actualiza el gráfico de Rutinas
        const rutinasData = dataRutinas.map(row => ({
            nombre: row.nombre_rutina,  // Asegúrate de que esta propiedad exista
            total: row.total_rutina     // Y que esta también esté presente
        }));

        updateChart(chartRutinas,
            rutinasData.map(rutina => rutina.nombre),
            rutinasData.map(rutina => rutina.total)
        );

    } catch (error) {
        console.error('Error al filtrar datos:', error);
    }
}

async function cargarImagenUsuario() {
    try {
        // Hacer una solicitud al endpoint que devuelve la imagen
        const respuesta = await fetch('/api/blobAImagen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Para enviar cookies de sesión
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo cargar la imagen del usuario');
        }

        const datos = await respuesta.json();

        if (!datos.imagen) {
            console.error('No se recibió una imagen válida.');
            return;
        }

        // Asignar la imagen al elemento <img> usando el ID
        const imgElemento = document.getElementById('imagenes-perfil');
        imgElemento.src = datos.imagen; // datos.imagen es el Base64 devuelto por la API
    } catch (error) {
        console.error('Error al cargar la imagen:', error);
    }
}
cargarImagenUsuario()



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