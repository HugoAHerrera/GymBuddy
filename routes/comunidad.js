const express = require('express');
const router = express.Router();
const database = require('../database');

// Obtener mensajes de una comunidad
router.get('/', async (req, res) => {
    const { comunidad } = req.query;
    if (!comunidad) return res.status(400).json({ error: 'El nombre de la comunidad es requerido' });

    try {
        const mensajes = await database.obtenerMensajes(comunidad);
        res.status(200).json(mensajes);
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Enviar mensaje a una comunidad
router.post('/', async (req, res) => {
    const { contenido, comunidad, id_emisor } = req.body;
    if (!contenido || !comunidad || !id_emisor) {
        return res.status(400).json({ error: 'Contenido, comunidad y emisor son requeridos' });
    }

    const fecha = new Date();
    const hora = fecha.toLocaleTimeString(); // Obtiene la hora actual
    const fechaHoy = fecha.toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

    try {
        const sql = 'INSERT INTO mensajes (id_emisor, contenido, receptor, hora, fecha) VALUES (?, ?, ?, ?, ?)';
        await database.query(sql, [id_emisor, contenido, comunidad, hora, fechaHoy]);

        res.status(200).json({ message: 'Mensaje enviado con éxito' });
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).json({ error: 'Error al guardar el mensaje' });
    }
});

module.exports = router;
