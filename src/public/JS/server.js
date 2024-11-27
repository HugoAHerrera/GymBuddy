const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Simulación de la base de datos
let chats = [
    { id: 1, name: "Juan Pérez", messages: [] },
    { id: 2, name: "Grupo GymBuddy", messages: [] },
];

// Obtener lista de chats
app.get("/api/chats", (req, res) => {
    res.json(chats.map(chat => ({ id: chat.id, name: chat.name })));
});

// Obtener mensajes de un chat
app.get("/api/chats/:id", (req, res) => {
    const chat = chats.find(c => c.id === parseInt(req.params.id));
    if (!chat) return res.status(404).send("Chat no encontrado.");
    res.json(chat.messages);
});

// Enviar mensaje
app.post("/api/chats/:id/messages", (req, res) => {
    const chat = chats.find(c => c.id === parseInt(req.params.id));
    if (!chat) return res.status(404).send("Chat no encontrado.");
    const { message, sentBy } = req.body; // sentBy: "user" o "other"
    chat.messages.push({ message, sentBy });
    res.status(201).send(chat.messages);
});

// Servidor en puerto 5000
app.listen(5000, () => console.log("Servidor corriendo en http://localhost:5000"));
