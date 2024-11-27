const simulatedDB = [
    { destinatario: "Grupo GymBuddy", emisor: "Carlos", mensaje: "¡Hola a todos!", fecha: "2024-11-07", hora: "14:00" },
    { destinatario: "Grupo GymBuddy", emisor: "María", mensaje: "¿Qué tal el entrenamiento?", fecha: "2024-11-07", hora: "14:02" },
    { destinatario: "Juan Pérez", emisor: "Juan Pérez", mensaje: "¡Hola! ¿Cómo estás?", fecha: "2024-11-07", hora: "14:05" },
    { destinatario: "Juan Pérez", emisor: "Mi Usuario", mensaje: "Todo bien, gracias. ¿Y tú?", fecha: "2024-11-07", hora: "14:06" },
];

let activeChat = null;

// Referencias
const chatList = document.getElementById("chat-users");
const chatTitle = document.getElementById("chat-title");
const chatMessages = document.getElementById("messages");
const chatInput = document.getElementById("chat-input");
const chatControls = document.getElementById("chat-controls");
const sendButton = document.getElementById("send-button");

// Carga chats
function loadChats() {
    const chats = [...new Set(simulatedDB.map(msg => msg.destinatario))];
    chatList.innerHTML = chats.map(chat => `<li>${chat}</li>`).join("");
}

// Carga mensajes
function loadMessages(chatName) {
    const messages = simulatedDB.filter(msg => msg.destinatario === chatName);
    messages.sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));

    chatMessages.innerHTML = messages
        .map(msg => {
            const isUser = msg.emisor === "Mi Usuario";
            return `
                <div class="message ${isUser ? "sent" : "received"}">
                    ${!isUser && msg.destinatario === "Grupo GymBuddy" ? `<div class="sender">${msg.emisor}</div>` : ""}
                    ${msg.mensaje}
                </div>
            `;
        })
        .join("");

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Selección de chat
chatList.addEventListener("click", e => {
    const chatName = e.target.textContent;
    activeChat = chatName;

    chatTitle.textContent = chatName;
    chatControls.classList.remove("hidden");

    loadMessages(chatName);
});

// Enviar mensaje
sendButton.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (!message || !activeChat) return;

    const newMessage = {
        destinatario: activeChat,
        emisor: "Mi Usuario",
        mensaje: message,
        fecha: new Date().toISOString().split("T")[0],
        hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    simulatedDB.push(newMessage);
    chatInput.value = "";

    loadMessages(activeChat);
});

// Inicialización
loadChats();
