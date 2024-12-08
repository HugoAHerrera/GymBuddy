document.addEventListener('DOMContentLoaded', () => {
    const communityList = document.getElementById('community-list');
    const chatMessages = document.getElementById('chat-messages');
    const currentCommunityEl = document.getElementById('current-community');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    let currentCommunity = 'General';
    let currentUserId = null;
    let currentUserName = null;

    // Obtener usuario actual
    async function getCurrentUser() {
        try {
            const response = await fetch('/api/mi-usuario');
            if (!response.ok) {
                console.log('Usuario no logueado o error al obtener el usuario.');
                return;
            }
            const data = await response.json();
            currentUserId = data.id_usuario;
            currentUserName = data.nombre_usuario;
        } catch (err) {
            console.error('Error al obtener el usuario actual:', err);
        }
    }

    // Cargar mensajes de la comunidad actual
    async function loadMessages(comunidad) {
        try {
            const response = await fetch(`/api/mensajes?comunidad=${encodeURIComponent(comunidad)}`);
            if (!response.ok) {
                console.error('Error al cargar los mensajes');
                return;
            }
            const data = await response.json();
            renderMessages(data);
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    }

    // Renderizar los mensajes
    function renderMessages(messages) {
        chatMessages.innerHTML = '';

        messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('message');

            // Si el mensaje es del usuario actual, 'sent', si no 'received'
            if (msg.id_emisor === currentUserId) {
                msgDiv.classList.add('sent');
            } else {
                msgDiv.classList.add('received');
            }

            const senderEl = document.createElement('div');
            senderEl.classList.add('sender');
            senderEl.textContent = msg.nombre_usuario || ('Usuario '+msg.id_emisor);

            const contentEl = document.createElement('div');
            contentEl.classList.add('content');
            contentEl.textContent = msg.contenido;

            const timeEl = document.createElement('div');
            timeEl.classList.add('time');
            const fecha = new Date(msg.fecha + ' ' + msg.hora);
            const horaFormateada = fecha.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
            timeEl.textContent = horaFormateada;

            msgDiv.appendChild(senderEl);
            msgDiv.appendChild(contentEl);
            msgDiv.appendChild(timeEl);

            chatMessages.appendChild(msgDiv);
        });

        // Scroll al final
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Enviar mensaje
    async function sendMessage() {
        const contenido = messageInput.value.trim();
        if (!contenido) return;

        if (!currentUserId) {
            console.error('No hay usuario logueado. No se puede enviar mensaje.');
            return;
        }

        const data = {
            contenido: contenido,
            comunidad: currentCommunity,
            id_emisor: currentUserId
        };

        try {
            const response = await fetch('/api/mensajes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                messageInput.value = '';
                loadMessages(currentCommunity);
            } else {
                console.error('Error al enviar el mensaje');
            }
        } catch (err) {
            console.error('Error al enviar el mensaje:', err);
        }
    }

    // Cambiar de comunidad al hacer clic
    communityList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const lis = communityList.querySelectorAll('li');
            lis.forEach(li => li.classList.remove('active'));

            e.target.classList.add('active');
            currentCommunity = e.target.getAttribute('data-comunidad');
            currentCommunityEl.textContent = currentCommunity;
            loadMessages(currentCommunity);
        }
    });

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    (async function init() {
        await getCurrentUser();
        loadMessages(currentCommunity);

        // Actualizar mensajes cada segundo
        setInterval(() => {
            loadMessages(currentCommunity);
        }, 1000);
    })();
});

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
