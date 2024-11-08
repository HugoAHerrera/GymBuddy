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

function filterData(period) {
    let labels, dataDistanciaMaxima, dataPR, dataCaloriasQuemadas, dataDuracionSesion, dataPesoCorporal, dataFrecuenciaCardiaca;

    switch (period) {
        case 'semana':
            labels = ['07/10/24', '08/10/24', '09/10/24', '10/10/24', '11/10/24', '12/10/24', '13/10/24'];
            dataDistanciaMaxima = [5, 10, 7, 8, 6, 9, 11];
            dataPR = [50, 55, 60, 65, 70, 75, 80];
            dataCaloriasQuemadas = [200, 250, 300, 350, 400, 450, 500];
            dataDuracionSesion = [30, 45, 40, 50, 60, 55, 70];
            dataPesoCorporal = [70, 71, 72, 73, 74, 75, 76];
            dataFrecuenciaCardiaca = [60, 62, 64, 66, 68, 70, 72];
            break;
        case 'mes':
            labels = ['01/10/24', '08/10/24', '15/10/24', '22/10/24', '29/10/24'];
            dataDistanciaMaxima = [50, 60, 55, 65, 70];
            dataPR = [100, 110, 105, 115, 120];
            dataCaloriasQuemadas = [1000, 1200, 1100, 1300, 1400];
            dataDuracionSesion = [300, 350, 320, 370, 400];
            dataPesoCorporal = [70, 71, 72, 73, 74];
            dataFrecuenciaCardiaca = [60, 62, 64, 66, 68];
            break;
        case 'año':
            labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            dataDistanciaMaxima = [200, 220, 210, 230, 240, 250, 260, 270, 280, 290, 300, 310];
            dataPR = [200, 220, 210, 230, 240, 250, 260, 270, 280, 290, 300, 310];
            dataCaloriasQuemadas = [2000, 2200, 2100, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100];
            dataDuracionSesion = [600, 650, 620, 670, 700, 750, 720, 770, 800, 850, 820, 870];
            dataPesoCorporal = [70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81];
            dataFrecuenciaCardiaca = [60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82];
            break;
        case 'total':
            labels = ['2020', '2021', '2022', '2023', '2024'];
            dataDistanciaMaxima = [1000, 1100, 1050, 1150, 1200];
            dataPR = [500, 550, 525, 575, 600];
            dataCaloriasQuemadas = [5000, 5500, 5250, 5750, 6000];
            dataDuracionSesion = [3000, 3500, 3200, 3700, 4000];
            dataPesoCorporal = [70, 71, 72, 73, 74];
            dataFrecuenciaCardiaca = [60, 62, 64, 66, 68];
            break;
    }

    updateChart(chartDistanciaMaxima, labels, dataDistanciaMaxima);
    updateChart(chartPR, labels, dataPR);
    updateChart(chartCaloriasQuemadas, labels, dataCaloriasQuemadas);
    updateChart(chartDuracionSesion, labels, dataDuracionSesion);
    updateChart(chartPesoCorporal, labels, dataPesoCorporal);
    updateChart(chartFrecuenciaCardiaca, labels, dataFrecuenciaCardiaca);
}

function updateChart(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

document.addEventListener('DOMContentLoaded', function () {
    const ctxDistanciaMaxima = document.getElementById('chart-distancia-maxima').getContext('2d');
    const ctxPR = document.getElementById('chart-pr').getContext('2d');
    const ctxCaloriasQuemadas = document.getElementById('chart-calorias-quemadas').getContext('2d');
    const ctxDuracionSesion = document.getElementById('chart-duracion-sesion').getContext('2d');
    const ctxPesoCorporal = document.getElementById('chart-peso-corporal').getContext('2d');
    const ctxFrecuenciaCardiaca = document.getElementById('chart-frecuencia-cardiaca').getContext('2d');

    const labels = ['07/10/24', '08/10/24', '09/10/24', '10/10/24', '11/10/24', '12/10/24', '13/10/24'];

    chartDistanciaMaxima = new Chart(ctxDistanciaMaxima, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distancia Maxima (km)',
                data: [5, 10, 7, 8, 6, 9, 11],
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

    chartPR = new Chart(ctxPR, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Record Personal (kg)',
                data: [50, 55, 60, 65, 70, 75, 80],
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

    chartCaloriasQuemadas = new Chart(ctxCaloriasQuemadas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Calorias Quemadas (kcal)',
                data: [200, 250, 300, 350, 400, 450, 500],
                borderColor: 'rgba(255, 159, 64, 1)',
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

    chartDuracionSesion = new Chart(ctxDuracionSesion, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Duración de Sesión (min)',
                data: [30, 45, 40, 50, 60, 55, 70],
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

    chartPesoCorporal = new Chart(ctxPesoCorporal, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Peso Corporal (kg)',
                data: [70, 71, 72, 73, 74, 75, 76],
                borderColor: 'rgba(54, 162, 235, 1)',
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

    chartFrecuenciaCardiaca = new Chart(ctxFrecuenciaCardiaca, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frecuencia Cardiaca (bpm)',
                data: [60, 62, 64, 66, 68, 70, 72],
                borderColor: 'rgba(255, 206, 86, 1)',
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
});

document.addEventListener('DOMContentLoaded', function() {
    const logoImage = document.getElementById('logotype');
    
    logoImage.addEventListener('click', function() {
        window.location.href = 'perfil.html';
    });
  });