fetch('../HTML/footer.html')
.then(response => response.text())
.then(data => document.getElementById('footer-container').innerHTML = data);

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const category = document.getElementById('category').value;

    if (!email || !username || !category) {
        alert('Por favor, completa todos los campos obligatorios.');
        return; 
    }

    const confirmationMessage = document.getElementById('confirmation-message');
    confirmationMessage.style.display = 'block';

    setTimeout(() => {
        confirmationMessage.style.display = 'none';
    }, 3000);
});
