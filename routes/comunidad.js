const express = require('express');
const router = express.Router();
const database = require('../database');  // Para interactuar con la base de datos

// Obtener mensajes de una comunidad
router.get('/', async (req, res) => {
    const { comunidad } = req.query;  // Nombre de la comunidad (por ejemplo: 'general', 'Deportes montaña', etc.)
    if (!comunidad) return res.status(400).json({ error: 'El nombre de la comunidad es requerido' });

    try {
        // Llamar a la base de datos para obtener los mensajes de la comunidad
        const mensajes = await database.obtenerMensajes(comunidad);
        res.status(200).json(mensajes);  // Enviar los mensajes como respuesta
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Enviar mensaje a una comunidad
router.post('/', async (req, res) => {
    const { contenido, comunidad } = req.body;  // Datos del mensaje: contenido y nombre de la comunidad
    const id_emisor = req.session.id_usuario;  // ID del usuario logueado

    if (!contenido || !comunidad || !id_emisor) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        // Guardar el mensaje en la base de datos
        await database.enviarMensaje({ contenido, comunidad, id_emisor });
        res.status(201).json({ message: 'Mensaje enviado con éxito' });
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;  // Exportar el router para usarlo en server.js
