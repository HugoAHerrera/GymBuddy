document.addEventListener("DOMContentLoaded", () => {
    const communityList = document.querySelectorAll(".community-group");  // Lista de comunidades
    const chatMessages = document.getElementById("chat-messages");  // Contenedor de los mensajes
    const messageInput = document.getElementById("message-input");  // Campo para escribir mensaje
    const sendButton = document.getElementById("send-button");  // Botón de enviar
    const currentGroupTitle = document.getElementById("current-group");  // Título de la comunidad activa
    let currentGroup = null;  // Variable para almacenar la comunidad seleccionada

    // Función para cargar los mensajes de la comunidad
    const loadMessages = async (groupName) => {
        try {
            console.log("Cargando mensajes para la comunidad:", groupName); // Verificar qué comunidad se está seleccionando
            const response = await fetch(`/api/mensajes?comunidad=${groupName}`);
            if (!response.ok) {
                throw new Error("Error al obtener los mensajes");
            }
            const messages = await response.json();  // Parsear los mensajes
            console.log("Mensajes cargados:", messages);  // Verificar si los mensajes son recibidos correctamente

            // Limpiar mensajes previos
            chatMessages.innerHTML = messages
                .map(
                    (msg) => `
                    <div class="message-container">
                        <div class="message">
                            <div class="message-header">
                                <strong class="sender-name">${msg.emisor}</strong>
                                <span class="message-time">${msg.fecha} ${msg.hora}</span>
                            </div>
                            <div class="message-body">
                                ${msg.contenido}
                            </div>
                        </div>
                    </div>
                `
                )
                .join("");  // Unir todos los mensajes en un solo string

            chatMessages.scrollTop = chatMessages.scrollHeight;  // Desplazar hacia el último mensaje
        } catch (error) {
            console.error("Error al cargar mensajes:", error);
        }
    };

    // Función para enviar un mensaje
    sendButton.addEventListener("click", async () => {
        const message = messageInput.value.trim();  // Obtener el mensaje escrito
        if (!message || !currentGroup) {
            console.log("No se pudo enviar el mensaje: No hay mensaje o no se seleccionó una comunidad.");
            return;  // Si no hay mensaje o no hay comunidad seleccionada, no hacer nada
        }

        console.log("Enviando mensaje:");
        console.log("Contenido:", message);
        console.log("Comunidad:", currentGroup);

        try {
            const response = await fetch("/api/mensajes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contenido: message,
                    comunidad: currentGroup,
                }),
            });

            if (response.ok) {
                console.log("Mensaje enviado con éxito");
                messageInput.value = "";  // Limpiar el campo de texto
                loadMessages(currentGroup);  // Recargar los mensajes de la comunidad seleccionada
            } else {
                console.error("Error al enviar el mensaje:", await response.text());
            }
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    });

    // Cambiar de comunidad al hacer clic en una
    communityList.forEach((group) =>
        group.addEventListener("click", (e) => {
            const groupName = e.target.dataset.group;  // Obtener el nombre de la comunidad
            currentGroup = groupName;  // Establecer la comunidad seleccionada
            currentGroupTitle.textContent = groupName;  // Actualizar el título

            // Resaltar la comunidad seleccionada
            communityList.forEach((g) => g.classList.remove("active"));
            e.target.classList.add("active");

            console.log("Comunidad seleccionada:", groupName);
            loadMessages(groupName);  // Cargar los mensajes de la comunidad seleccionada
        })
    );

    // Inicializar la primera comunidad (General) al cargar la página
    if (communityList.length > 0) {
        communityList[0].click();  // Simular un clic en la primera comunidad
    }

    // Cargar los mensajes cada 3 segundos
    setInterval(() => {
        if (currentGroup) {
            loadMessages(currentGroup);  // Recargar los mensajes de la comunidad cada 3 segundos
        }
    }, 3000);
});
