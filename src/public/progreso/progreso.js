function expandChart(chartId) {
    // Obtener todas las gráficas
    const charts = document.querySelectorAll('.chart-section');

    // Reducir todas las gráficas a su tamaño original (altura normal)
    charts.forEach(chart => {
        chart.style.height = "150px";  // Ajusta la altura original
    });

    // Expandir solo la gráfica clickeada
    const selectedChart = document.getElementById(chartId);
    selectedChart.style.height = "300px";  // Expande la gráfica a 300px de altura, ajusta si necesitas más
}
