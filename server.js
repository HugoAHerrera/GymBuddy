
const express = require('express');
const path = require('path');
require('dotenv').config();
const database = require('./database');

const app = express();

app.use(express.static(path.join(__dirname, 'src/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    try {
      const users = await database.getAllUsers();
      console.log('Usuarios obtenidos al iniciar el servidor:', users);
    } catch (error) {
        console.error('Error al obtener los usuarios al iniciar el servidor:', error.message);
    }
});
