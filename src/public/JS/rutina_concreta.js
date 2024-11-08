document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-guia').forEach(button => {
        button.addEventListener('click', () => {
            window.open('guia_ejercicios.html', '_blank');
        });
    });
});
