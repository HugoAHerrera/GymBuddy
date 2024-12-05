
const express = require('express');
const path = require('path');
require('dotenv').config();
const database = require('./database');
const { encriptarContraseña, compararContraseña } = require('./encryptor');

const app = express();

app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.json());  // Esto es necesario, req.body sea un objeto JSON

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/index.html'));
});

app.post('/api/usuario-existe', async (req, res) => {
  const { nombre_usuario } = req.body;

  try {
      const user = await database.comprobarUsuarioExistente(nombre_usuario);

      if (user) {
          return res.status(400).json({ usuarioExiste: true });
      }

      res.status(200).json({ usuarioExiste: false });
  } catch (error) {
      console.error('Error al verificar el usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

app.post('/api/correo-existe', async (req, res) => {
  const { correo } = req.body;

  try {
      const correoExiste = await database.comprobarCorreoExistente(correo);
      
      if (correoExiste) {
          return res.status(400).json({ correoExiste: true });
      }

      res.status(200).json({ correoExiste: false });
  } catch (error) {
      console.error('Error al verificar el correo electrónico:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/api/registro', async (req, res) => {
  const { nombre_usuario, contraseña, correo } = req.body;

  if (!nombre_usuario || !contraseña || !correo) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    const contraseñaHashed = await encriptarContraseña(contraseña);
    const result = await database.registrarUsuario({ 
        nombre_usuario, 
        contraseña: contraseñaHashed, 
        correo 
    });
    res.status(201).json({ message: 'Usuario registrado con éxito', id: result.insertId });
  } catch (error) {
    console.error('Error:', error); 
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    const user = await database.comprobarCredenciales(email);

    if (!user) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const isValid = await compararContraseña(contraseña, user.contraseña);

    if (!isValid) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
  }
});


app.get('/inicio', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/HTML/inicio.html'));
});

app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/perfil.html'))
})

app.get('/rutina', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/HTML/rutina.html'));
});

app.get('/api/rutinas', async (req, res) => {
  try {
      const rutinas = await database.obtenerRutinas();
      res.json(rutinas);
  } catch (error) {
      console.error('Error al obtener rutinas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/progreso', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/Progreso.html'));
});

app.get('/api/sesiones', async (req, res) => {
    const { periodo } = req.query; // Obtener el parámetro 'periodo' del query string

    try {
        // Pasar el periodo como argumento a la función obtenerSesiones
        const sesiones = await database.obtenerSesiones(periodo);

        console.log(sesiones); // Log para verificar las sesiones obtenidas
        res.json(sesiones);
    } catch (error) {
        console.error('Error al obtener sesiones:', error);

        // Devolver un mensaje de error más específico según el caso
        if (error.message === 'Periodo no válido') {
            res.status(400).json({ error: 'El periodo especificado no es válido' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});

app.get('/api/estadisticas/', async (req, res) => {
    try {
        const estadisticas = await database.obtenerEstadisticasSesiones();
        console.log(estadisticas);
        res.json(estadisticas);
    } catch (error) {
        console.error('Error al obtener estadisticas', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/*app.get('/api/guiaejercicios/', async(req, res => {
    try{
        const descripcionEjercicios = database.obtenerDescripcionEjercicios();
        console.log(descripcionEjercicios)
        res.json(descripcionEjercicios);
    }catch (error) {
        console.error('Error al obtener la descripcion de los ejercicios', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}))*/


app.get('/Desafios', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/public/HTML/MetasPersonales.html'));
});

app.post('/api/mensajes', async (req, res) => {
    const { id_emisor, receptor, contenido } = req.body;

    if (!id_emisor || !receptor || !contenido) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    const mensaje = {
        id_emisor,
        receptor,
        contenido,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fecha: new Date().toISOString().split('T')[0],
    };

    try {
        await database.agregarMensaje(mensaje);
        res.status(201).json({ message: 'Mensaje enviado con éxito' });
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

app.get('/api/mensajes', async (req, res) => {
    const { receptor } = req.query;

    if (!receptor) {
        return res.status(400).json({ message: 'El receptor es requerido' });
    }

    try {
        const mensajes = await database.obtenerMensajes(receptor);
        res.status(200).json(mensajes);
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

app.get('/api/usuarios', async (req, res) => {
    const { query } = req.query; // El término de búsqueda

    if (!query) {
        return res.status(400).json({ message: 'El término de búsqueda es requerido' });
    }

    try {
        const usuarios = await database.buscarUsuarios(query);
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

