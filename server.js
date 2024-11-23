
const express = require('express');
const path = require('path');
require('dotenv').config();
const database = require('./database');

const app = express();

app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.json());  // Esto es necesario, req.body sea un objeto JSON

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/index.html'));
});

app.post('/api/register', async (req, res) => {
  const { nombre_usuario, contraseña, correo } = req.body;

  if (!nombre_usuario || !contraseña || !correo) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  console.log(req.body);

  try {
    const result = await database.addUser({ nombre_usuario, contraseña, correo });
    res.status(201).json({ message: 'Usuario registrado con éxito', id: result.insertId });
  } catch (error) {
    console.error('Error:', error); 
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

app.get('/inicio', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/HTML/inicio.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
