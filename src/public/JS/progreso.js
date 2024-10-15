function expandChart(chartId) {
    // Obtener todas las gráficas
    const charts = document.querySelectorAll('.chart-section');

    // Reducir todas las gráficas a su tamaño original (altura normal)
    charts.forEach(chart => {
        if (chart.id !== chartId) {
            chart.style.height = "150px";  // Altura original para todas las gráficas que no fueron clickeadas
        }
    });

    // Expandir o contraer la gráfica clickeada
    const selectedChart = document.getElementById(chartId);

    // Verificar si la gráfica ya está expandida
    if (selectedChart.style.height === "300px") {
        // Si ya está expandida, reducirla de nuevo
        selectedChart.style.height = "150px";
    } else {
        // Si no está expandida, agrandarla
        selectedChart.style.height = "300px";
    }
}
