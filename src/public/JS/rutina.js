document.querySelectorAll('.recomendacion, .rutina').forEach(item => {
    item.addEventListener('click', () => {
        window.open('rutina_concreta.html', '_blank');
    });
});
