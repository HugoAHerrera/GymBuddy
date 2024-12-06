document.addEventListener("DOMContentLoaded", () => {
    // Cargar el header dinámicamente
    $("#header-container").load("../HTML/header.html");

    const groupList = document.querySelectorAll(".community-group");
    const chatMessages = document.getElementById("chat-messages");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const currentGroupTitle = document.getElementById("current-group");
    let currentGroup = null;

    // Cargar mensajes del grupo seleccionado
    const loadGroupMessages = async (groupName) => {
        try {
            const response = await fetch(`/api/comunidad?group=${groupName}`);
            const messages = await response.json();

            chatMessages.innerHTML = messages
                .map(
                    (msg) => `
                <div>
                    <strong>${msg.emisor}:</strong> ${msg.contenido}
                </div>
            `
                )
                .join("");
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            console.error("Error al cargar mensajes:", error);
        }
    };

    // Cambiar grupo
    groupList.forEach((group) =>
        group.addEventListener("click", (e) => {
            const groupName = e.target.dataset.group;
            currentGroup = groupName;
            currentGroupTitle.textContent = groupName;

            groupList.forEach((g) => g.classList.remove("active"));
            e.target.classList.add("active");

            loadGroupMessages(groupName);
        })
    );

    // Enviar mensaje
    sendButton.addEventListener("click", async () => {
        const message = messageInput.value.trim();
        if (!message || !currentGroup) return;

        try {
            await fetch("/api/comunidad", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    group: currentGroup,
                    contenido: message,
                }),
            });

            messageInput.value = "";
            loadGroupMessages(currentGroup);
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    });
});
