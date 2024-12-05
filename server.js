
const express = require('express');
const path = require('path');
require('dotenv').config();
const database = require('./database');
const { encriptarContraseña, compararContraseña } = require('./encryptor');
const session = require('express-session');
/* PARA SUBIR IMAGEN A BBDD. 
SI LO = MORIR
const multer = require('multer');
const upload = multer(); // Configuración básica para manejar multipart/form-data
*/



const app = express();


app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.json());  // Esto es necesario, req.body sea un objeto JSON
// Configuración de la sesión
app.use(session({
    secret: 'mi_clave_secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // En producción, usa `secure: true` si usas HTTPS
}));


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
      
      // Redirigir al usuario a la página de inicio después de un registro exitoso
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

    if (!user) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const isValid = await compararContraseña(contraseña, user.contraseña);

    if (!isValid) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    req.session.id_usuario = user.id_usuario;
    console.log('id:',req.session.id_usuario)

    res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
  }
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

app.get('/rutina-concreta', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/HTML/rutina_concreta.html'));
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

app.get('/inicio', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/inicio.html'));
  });
  
app.get('/perfil', (req, res) => {
    if (!req.session.id_usuario) {
        return res.status(400).send('ID de usuario no proporcionado');
    }
    console.log('Perfil:',req.session.id_usuario)
    res.sendFile(path.join(__dirname, 'src/public/HTML/perfil.html'));
});


app.post('/api/cambiarNombreUsuario', async (req, res) => {
    try {
        // Obtenemos el nuevo nombre de usuario del cuerpo de la solicitud
        const { nombre_usuario } = req.body;
        console.log("nombre:",nombre_usuario)

        // Verificamos si se recibió el nuevo nombre de usuario
        if (!nombre_usuario) {
            return res.status(400).json({ error: 'El nombre de usuario es obligatorio.' });
        }

        // Aquí llamamos a una función ficticia que actualizaría el nombre en la base de datos
        // La función `cambiarNombreUsuario` debe retornar el nuevo nombre actualizado
        const nuevoNombreUsuario = await database.cambiarNombreUsuario(req.session.id_usuario, nombre_usuario);

        // Respondemos con el nuevo nombre de usuario
        res.json({
            message: 'Perfil: El nombre se ha cambiado a ',
            nuevoNombreUsuario: nuevoNombreUsuario
        });
    } catch (error) {
        console.error('Error al cambiar el nombre de usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/descripcion', async (req, res) => {
    const { idUsuario } = req.body; // Recibe el ID del usuario del formulario
    
    try {
        // Llama a la función para obtener la descripción del usuario
        const descripcionUsuario = await database.obtenerDescripcionUsuario(idUsuario);
        console.log('Descripción del usuario obtenida correctamente');
        res.json({ message: 'Descripción del usuario obtenida correctamente', descripcionUsuario });
    } catch (error) {
        console.error('Error al obtener la descripción del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
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

// COSAS PARA LA PAGINA DESAFIOS
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

<<<<<<< HEAD
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

=======
app.post('/api/guardarMeta', async (req, res) => {
    console.log("Datos recibidos:", req.body);
    const { titulo, desc, recompensa } = req.body;

    if (!titulo || !desc || !recompensa) {
        console.error("Datos incompletos:", req.body);
        return res.status(400).json({ message: 'Faltan datos para guardar el desafío.' });
    }
    try {
        const result = await database.guardarMeta({
            titulo,
            desc,
            recompensa
        });
        res.status(201).json({ message: 'Desafio guardado con éxito', id: result.insertId });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error', error: error.message });
        }
    });

app.post('/api/borrarMeta', async (req, res) => {
    const titulo = req.body;
    try {
        await database.borrarMeta(titulo);
        res.status(201).json({ message: 'Desafio borrado con éxito' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error', error: error.message });
        }
    });

app.post('/api/actualizarNumeroMetas', async (req, res) => {
    const titulos = req.body;
    try {
        for(let i = 0; i < titulos.length; i++){
            await database.actualizarNumerosMetas(titulos[i]);
            res.status(201).json({ message: 'Desafio borrado con éxito' });
        }
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error', error: error.message });
        }
    });

// falta por poner en front?
app.get('/api/recuperarMetas', async (req, res) => {
    try {
        const infoDesafios = await database.obtenerDesafios();
        console.log(infoDesafios);
        res.json(infoDesafios);
    }
    catch (error) {
        console.error('Error al recuperar los desafios', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/actualizarProgreso', async (req, res) => {
    const porcentage = req.body;
    try {
        const result = await database.actualizarProgreso(porcentage);
        res.status(201).json({ message: 'Progreso actualizado con éxito' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error', error: error.message });
        }
    });
>>>>>>> 236c20bcfda75141a0e7361317d2049613d7db5e
