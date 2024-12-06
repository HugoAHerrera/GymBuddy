
const express = require('express');
const path = require('path');
require('dotenv').config();
const database = require('./database');
const { encriptarContraseña, compararContraseña } = require('./encryptor');
const session = require('express-session');
const mysql = require('mysql2');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const app = express();

app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.json());

// Sesión
app.use(session({
    secret: 'mi_clave_secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    const id = req.body.id;
    const file = req.file;
    if (!file) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }
    database.añadirFotoEjercicio(id,file.buffer);
});

app.post('/api/usuario-existe', async (req, res) => {
  const { nombre_usuario } = req.body;
  try {
      const user = await database.comprobarUsuarioExistente(nombre_usuario);
      if (user) return res.status(400).json({ usuarioExiste: true });
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
      if (correoExiste) return res.status(400).json({ correoExiste: true });
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
      await database.registrarUsuario({ nombre_usuario, contraseña: contraseñaHashed, correo });
      res.redirect('/inicio');
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
    if (!user) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const isValid = await compararContraseña(contraseña, user.contraseña);
    if (!isValid) return res.status(401).json({ message: 'Credenciales incorrectas' });

    req.session.id_usuario = user.id_usuario;
    console.log('id:',req.session.id_usuario);
    res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Rutas de páginas
app.get('/inicio', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/inicio.html'));
});
app.get('/tienda', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/tienda.html'));
});
app.get('/comunidad', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/comunidad.html'));
});
app.get('/progreso', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/progreso.html'));
});
app.get('/rutina', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/HTML/rutina.html'));
});
app.get('/rutina-concreta', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/rutina_concreta.html'));
});
app.get('/desafios', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/public/HTML/MetasPersonales.html'));
});
app.get('/carro', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/public/HTML/carro.html'));
});
app.get('/pagar', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/public/HTML/pagar.html'));
});

app.get('/api/rutina-concreta', async (req, res) => {
    const rutinaNombre = req.query.id;
    try {
        const ejercicios = await database.obtenerEjercicios(rutinaNombre);
        if (ejercicios.length > 0) res.json({ rutinaNombre, ejercicios });
        else res.status(404).json({ error: 'Rutina no encontrada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los ejercicios' });
    }
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

app.get('/api/guia_ejercicios',async(req,res) => {
    res.sendFile(path.join(__dirname, '/src/public/HTML/guia_ejercicios.html'));
});

app.post('/api/guia-ejercicios', async (req, res) => {
    try {
        const guia = await database.obtenerDescripcionEjercicios(70);
        console.log(guia);
        res.status(200).json(guia);
    } catch (error) {
        console.error('Error al obtener la guía de ejercicios:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.post('/guardar-sesion', async (req, res) => {
    const { tiempo_total, fecha, nombre_rutina } = req.body;
    if (!tiempo_total || !fecha || !nombre_rutina) {
        return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }
    try {
        const idUsuario = req.session.id_usuario;
        await database.guardarSesion(idUsuario, nombre_rutina, tiempo_total, fecha);
        res.json({ success: true, message: 'Sesión guardada con éxito' });
    } catch (error) {
        console.error('Error al guardar la sesión:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/blobAImagenEjercicio', upload.single('imagen'), async (req, res) => {
    try {
        const imagenBase64 = await database.convertirBlobImagenEj(70);
        if (!imagenBase64) return res.status(404).json({ error: 'No se encontró una imagen.' });
        res.status(200).json({ imagen: imagenBase64 });
    } catch (error) {
        console.error("Error al convertir el blob a imagen:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.get('/previewTerminosCondiciones', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/noUserTerminosCondiciones.html'));
});

app.get('/perfil', (req, res) => {
    if (!req.session.id_usuario) return res.status(400).send('ID de usuario no proporcionado');
    console.log('Perfil:',req.session.id_usuario);
    res.sendFile(path.join(__dirname, 'src/public/HTML/blob.html'));
});

app.post('/api/blob', upload.single('imagen'), async (req, res) => {
    // Ajustar según tu lógica de database.js
    try {
        const idEjercicio = req.body.idEjercicio;
        const imagenBuffer = req.file?.buffer;
        if (!idEjercicio || !imagenBuffer) {
            return res.status(400).json({ error: 'ID de ejercicio o imagen no proporcionados.' });
        }
        const result = await database.actualizarImagenEjercicio(idEjercicio, imagenBuffer);
        if (!result) return res.status(404).json({ error: 'Ejercicio no encontrado.' });
        res.status(200).json({ message: 'Imagen subida correctamente.' });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.post('/api/cambiarNombreUsuario', upload.single('imagen'), async (req, res) => {
    // Lógica compleja, mantener igual o simplificar.
    // Ajusta a tu necesidad.
    // ...
});

app.post('/api/blobAImagen', upload.single('imagen'), async (req, res) => {
    try {
        const imagenBase64 = await database.convertirBlobImagen(req.session.id_usuario);
        if (!imagenBase64) return res.status(404).json({ error: 'No se encontró una imagen.' });
        res.status(200).json({ imagen: imagenBase64 });
    } catch (error) {
        console.error("Error al convertir el blob a imagen:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.get('/api/obtenerDatosUsuario', async (req, res) => {
    try {
        const datosUsuario = await database.obtenerDatosUsuario(req.session.id_usuario);
        res.json({
            nombre_usuario: datosUsuario.nombre_usuario,
            correo: datosUsuario.correo,
            imagenes: datosUsuario.imagenes
        });
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.post('/api/descripcion', async (req, res) => {
    const { idUsuario } = req.body;
    try {
        const descripcionUsuario = await database.obtenerDescripcionUsuario(idUsuario);
        console.log('Descripción del usuario obtenida correctamente');
        res.json({ message: 'Descripción del usuario obtenida correctamente', descripcionUsuario });
    } catch (error) {
        console.error('Error al obtener la descripción del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/api/sesiones', async (req, res) => {
    const { periodo } = req.query;
    const idUsuario = req.session.id_usuario;
    if (!idUsuario) return res.status(400).json({ error: 'No se ha encontrado el id_usuario en la sesión' });

    try {
        const sesiones = await database.obtenerSesiones(idUsuario, periodo);
        console.log(sesiones);
        res.json(sesiones);
    } catch (error) {
        console.error('Error al obtener sesiones:', error);
        if (error.message === 'Periodo no válido') {
            res.status(400).json({ error: 'El periodo especificado no es válido' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});

app.get('/api/estadisticas/', async (req, res) => {
    const idUsuario = req.session.id_usuario;
    console.log('idUsuario:', idUsuario);
    if (!idUsuario) return res.status(400).json({ error: 'No se ha encontrado el id_usuario en la sesión' });
    try {
        const estadisticas = await database.obtenerEstadisticasSesiones(idUsuario);
        console.log(estadisticas);
        res.json(estadisticas);
    } catch (error) {
        console.error('Error al obtener estadísticas', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Metas/desafíos
// ... (mantén igual la lógica para metas, carro, etc.)

// Endpoint para obtener mensajes con el método de database
app.get('/api/mensajes', async (req, res) => {
    const { comunidad } = req.query;
    if (!comunidad) return res.status(400).json({ error: 'El nombre de la comunidad es requerido' });
    try {
        const mensajes = await database.obtenerMensajesComunidad(comunidad);
        res.status(200).json(mensajes);
    } catch (error) {
        console.error("Error al obtener los mensajes:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/api/mi-usuario', async (req, res) => {
    if (!req.session.id_usuario) return res.status(401).json({ error: 'No autenticado' });
    try {
        const user = await database.obtenerUsuarioPorId(req.session.id_usuario);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ id_usuario: user.id_usuario, nombre_usuario: user.nombre_usuario });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
