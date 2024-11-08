document.querySelectorAll('.recomendacion, .rutina').forEach(item => {
    item.addEventListener('click', () => {
        window.open('rutina_concreta.html', '_blank');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const logoImage = document.getElementById('logotype');
    
    logoImage.addEventListener('click', function() {
        window.location.href = 'perfil.html';
    });
  });