
const express = require('express');
const path = require('path');
require('dotenv').config();
const database = require('./database');
const { encriptarContraseña, compararContraseña } = require('./encryptor');
/* PARA SUBIR IMAGEN A BBDD. 
SI LO = MORIR
const multer = require('multer');
const upload = multer(); // Configuración básica para manejar multipart/form-data
*/
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

/*
app.get('/rutina', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/blob.html'));
});

app.post('/api/rutinas', upload.single('imagen'), async (req, res) => {
    const { idEjercicio } = req.body; // Recibe el ID del ejercicio del formulario
    const imagen = req.file.buffer; // Obtiene el archivo como Buffer

    try {
        // Llama a la función para guardar la imagen
        const imagen_añadida = await database.añadirFotoEjercicio(idEjercicio, imagen);
        console.log('Imagen añadida correctamente');
        res.json({ message: 'Imagen añadida correctamente', imagen_añadida });
    } catch (error) {
        console.error('Error al añadir imagen:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
*/

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


app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/perfil.html'))
})

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