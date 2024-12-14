const express = require('express');
const path = require('path');
require('dotenv').config();
const database = require('./database');
const { encriptarContraseña, compararContraseña } = require('./encryptor');
const session = require('express-session');
const mysql = require('mysql2');
const asistente = require('./asistente');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Configuración básica para manejar multipart/form-data

const app = express();


app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.json());  // Esto es necesario para que req.body sea un objeto JSON
// Configuración de la sesión
app.use(session({
    secret: 'mi_clave_secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // En producción, usar `secure: true` si se usa HTTPS
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    const id = req.body.id; // ID proporcionado por el usuario
    const file = req.file; // Datos del archivo subido

    if (!file) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }

    // Solo necesitamos el buffer (contenido binario) para la columna `imagen`
    database.añadirFotoEjercicio(id,file.buffer);
    //database.añadirFotoArticulo(id,file.buffer);
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

      const user = await database.comprobarCredenciales(correo);
      req.session.id_usuario = user.id_usuario;

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

    res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/api/cambiar-contrasena', async (req, res) => {
    const { email, contraseña, contraseña_nueva } = req.body;

    if (!email || !contraseña || !contraseña_nueva) {
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

        try {
            const contraseñaHashed = await encriptarContraseña(contraseña_nueva);
            const result = await database.cambiarContraseña({ contraseña: contraseñaHashed, correo: email });

            if (!result) {
                return res.status(500).json({ message: 'Error al cambiar la contraseña' });
            }

            return res.status(200).json({ message: 'Contraseña cambiada exitosamente' });

        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Error al cambiar la contraseña', error: error.message });
        }

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});


//Redirecciones del header
app.get('/inicio', (req, res) => {
    if (!req.session.id_usuario) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'src/public/HTML/inicio.html'));
});

app.get('/tienda', (req, res) => {
    if (!req.session.id_usuario) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'src/public/HTML/tienda.html'));
});

app.get('/comunidad', (req, res) => {
    if (!req.session.id_usuario) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'src/public/HTML/comunidad.html'));
});

app.get('/progreso', (req, res) => {
    if (!req.session.id_usuario) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'src/public/HTML/progreso.html'));
});

app.get('/rutina', (req, res) => {
    if (!req.session.id_usuario) {
        return res.redirect('/');
    }
  res.sendFile(path.join(__dirname, 'src/public/HTML/rutina.html'));
});

app.get('/rutina-concreta', (req, res) => {
    if (!req.session.id_usuario) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'src/public/HTML/rutina_concreta.html'));
});

app.get('/editar-rutina', (req, res) => {
    if (!req.session.id_usuario) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'src/public/HTML/rutina_editar.html'));
});

app.get('/rutina-nueva', (req,res) => {
    if (!req.session.id_usuario) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'src/public/HTML/rutina_nueva.html'));
})

app.get('/api/rutina-nueva', async (req, res) => {
    try {
        // Obtener datos de la base de datos
        const categoria = await database.obtenerCategoriaTodosEjercicio();
        const categoria_transformed = categoria.flatMap(item => 
            item.lista_ejercicios.split(',').map(ejercicio => [parseInt(ejercicio), item.categoria])
        );

        const id_nombre_dificultad = await database.obtenerIDNombreDificultadTodosEjercicio();
        const id_nombre_dificultad_transformed = id_nombre_dificultad.map(item => 
            [item.id_ejercicio, item.nombre_ejercicio, item.dificultad]
        );

        // Combinar los datos
        const combinados = categoria_transformed.map(([id, categoria]) => {
            const ejercicio = id_nombre_dificultad_transformed.find(([ejercicioId]) => ejercicioId === id);
            return ejercicio ? [id, categoria, ejercicio[1], ejercicio[2]] : null;
        }).filter(item => item !== null);

        if (combinados.length > 0) {  // Cambiado a .length > 0
            res.json({ combinados });
        } else {
            res.status(404).json({ error: 'Rutina no encontrada' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los ejercicios' });
    }
});

app.post('/api/guardar-rutina', async (req, res) => {
    try {
        const { rutina } = req.body; 
        
        const nombreRutina = rutina[0];
        const ejercicios = rutina.slice(1);
        
        const idUsuario = req.session.id_usuario;
        
        if (!idUsuario) {
            return res.status(400).json({ error: 'No se ha encontrado el id del usuario.' });
        }

        const resultado = await database.insertarRutina(idUsuario, nombreRutina, ejercicios);

        res.status(200).json({ message: 'Rutina guardada correctamente', data: resultado });
    } catch (error) {
        console.error('Error al guardar la rutina:', error);
        res.status(500).json({ error: 'Error al guardar la rutina.' });
    }
});

app.post('/api/guardar-rutina-existente', async (req, res) => {
    try {
        const { rutina, id_rutina } = req.body; 
        
        const rutinaArray = rutina[0].split(', ');
        
        const nombreRutina = rutinaArray[0];
        const ejercicios = rutinaArray.slice(1);
        const idRutina = id_rutina;

        const resultado = await database.actualizarRutina(nombreRutina, ejercicios, idRutina);

        res.status(200).json({ message: 'Rutina guardada correctamente', data: resultado });
    } catch (error) {
        console.error('Error al guardar la rutina:', error);
        res.status(500).json({ error: 'Error al guardar la rutina.' });
    }
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

app.get('/obtenerProducto', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/public/HTML/obtenerProducto.html'));
});

//Redireciones del footer
app.get('/terminosCondiciones', (req, res) => {
    if (!req.session.id_usuario) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'src/public/HTML/terminosCondiciones.html'));
});

app.get('/api/rutina-concreta', async (req, res) => {
    const rutinaNombre = req.query.id;
    try {
        const ejercicios = await database.obtenerEjercicios(rutinaNombre);

        if (ejercicios.length > 0) {
            res.json({ rutinaNombre, ejercicios });
        } else {
            res.status(404).json({ error: 'Rutina no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los ejercicios' });
    }
});

app.get('/api/rutinas', async (req, res) => {
    try {
        const idUsuario = req.session.id_usuario;
        const rutinas = await database.obtenerRutinas(idUsuario);
        res.json(rutinas);
    } catch (error) {
        console.error('Error al obtener rutinas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/api/rutPersonalizada', async (req, res) => {
    try {
        const idUsuario = req.session.id_usuario;
        const rutinas = await database.obtenerRutinasPersonales(idUsuario);
        res.json(rutinas);
    } catch (error) {
        console.error('Error al obtener rutinas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/guia-ejercicios',async(req,res) => {
    res.sendFile(path.join(__dirname, '/src/public/HTML/guia_ejercicios.html'));
});

app.post('/api/guia-ejercicios', async (req, res) => {
    try {
        const { nombre_ejercicio } = req.body;

        if (!nombre_ejercicio) {
            return res.status(400).json({ error: 'Nombre de ejercicio no proporcionado.' });
        }

        const guia = await database.obtenerDescripcionEjercicios(nombre_ejercicio);

        if (!guia) {
            return res.status(404).json({ error: 'Ejercicio no encontrado.' });
        }

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
        const { nombre_ejercicio } = req.body;

        if (!nombre_ejercicio) {
            return res.status(400).json({ error: 'Nombre de ejercicio no proporcionado.' });
        }

        const imagenBase64 = await database.convertirBlobImagenEj(nombre_ejercicio);
        
        if (!imagenBase64) {
            return res.status(404).json({ error: 'No se encontró una imagen para este usuario.' });
        }

        res.status(200).json({ imagen: imagenBase64 });
    } catch (error) {
        console.error("Error al convertir el blob a imagen ejercoco:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.post('/api/obtenerIdRutina', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre_rutina } = req.body;

        const id_rutina = await database.obtenerIdRutina(nombre_rutina);
        
        res.json({ id_rutina });

    } catch (error) {
        console.error('Error al obtener id_rutina:', error);
        res.status(500).json({ error: 'Hubo un error al obtener la rutina' });
    }
});

app.get('/previewTerminosCondiciones', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/noUserTerminosCondiciones.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/IMC', (req,res) => {
    if (!req.session.id_usuario) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'src/public/HTML/imc.html'));
})

app.get('/perfil', (req, res) => {
    if (!req.session.id_usuario) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'src/public/HTML/perfil.html'));
});


app.get('/api/tiempoEjercicio', async (req, res) => {
    try {
        const tiempo_lista = await database.obtenertiempoEjercicio(req.session.id_usuario);
        const tiempo = tiempo_lista[0].total_tiempo;
        res.json({
            tiempo: tiempo
        });
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.post('/api/blob', upload.single('imagen'), async (req, res) => {
    try {
        const idEjercicio = req.body.idEjercicio;
        const imagenBuffer = req.file?.buffer;

        if (!idEjercicio || !imagenBuffer) {
            return res.status(400).json({ error: 'ID de ejercicio o imagen no proporcionados.' });
        }

        // Aquí se asume que tienes una variable `connection` definida en otra parte o la obtienes de `database.js`.
        // Idealmente, usa métodos de `database.js` en vez de `connection` directo.
        // Ajusta este bloque según tu lógica de base de datos.
        const sql = 'UPDATE ejercicio SET imagen = ? WHERE id_ejercicio = ?';
        connection.query(sql, [imagenBuffer, idEjercicio], (err, results) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return res.status(500).json({ error: 'Error al guardar la imagen.' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Ejercicio no encontrado.' });
            }

            res.status(200).json({ message: 'Imagen subida correctamente.' });
        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.post('/api/cambiarNombreUsuario', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre_usuario, correo_usuario } = req.body;
        const imagen = req.file;

        const usuarioExistente = await database.comprobarUsuarioExistente(nombre_usuario);
        const correoExistente = await database.comprobarCorreoExistente(correo_usuario);
        // Esta lógica es muy específica. Ajusta según tu necesidad.
        if ( nombre_usuario == "" || correo_usuario == ""){
            return res.status(400).json({ error: 'Los campos Nombre Usuario y Mail Asociado son obligatorios 2' });
        }
        if (usuarioExistente && usuarioExistente.id !== req.session.id_usuario) {
            if (correoExistente && correoExistente.id !== req.session.id_usuario) {
                if(imagen){
                    await database.añadirFotoPerfil(req.session.id_usuario, imagen.buffer);
                    return res.status(400).json({ error: 'Usuario o/y Correo asociados a una cuenta. Foto Cambiada.' });
                } else {
                    return res.status(400).json({ error: 'Usuario o/y Correo asociados a una cuenta. Foto no Cambiada.'});
                }
            } else {
                if(imagen){
                    await database.cambiarCorreoUsuario(req.session.id_usuario, correo_usuario);
                    await database.añadirFotoPerfil(req.session.id_usuario, imagen.buffer);
                    return res.status(400).json({ error: 'Usuario asociado a una cuenta. Correo y Foto Cambiados.' });
                } else{
                    await database.cambiarCorreoUsuario(req.session.id_usuario, correo_usuario);
                    return res.status(400).json({ error: 'Usuario está asociado a una cuenta. Correo Cambiado. Foto no Cambiada' });
                }
            }
        } else{
            if (correoExistente && correoExistente.id !== req.session.id_usuario) {
                if(imagen){
                    await database.cambiarNombreUsuario(req.session.id_usuario, nombre_usuario);
                    await database.añadirFotoPerfil(req.session.id_usuario, imagen.buffer);
                    return res.status(400).json({ error: 'Correo está asociado a una cuenta. Foto Cambiada. Correo cambiado.' });
                } else {
                    await database.cambiarNombreUsuario(req.session.id_usuario, nombre_usuario);
                    return res.status(400).json({ error: 'Correo está asociado a una cuenta. Usuario Cambiado. Foto no Cambiada' });
                }
            } else {
                if(imagen){
                    await database.cambiarNombreUsuario(req.session.id_usuario, nombre_usuario);
                    await database.cambiarCorreoUsuario(req.session.id_usuario, correo_usuario);
                    return res.status(400).json({ error: 'El nombre de usuario ya existe. Correo cambiado' });
                } else{
                    await database.cambiarCorreoUsuario(req.session.id_usuario, correo_usuario);
                    await database.cambiarCorreoUsuario(req.session.id_usuario, correo_usuario);
                    await database.añadirFotoPerfil(req.session.id_usuario, imagen.buffer);
                    return res.json({ message: 'El perfil se ha actualizado correctamente.' });
                }
            }
        }
    } catch (error) {
        console.error('Error al cambiar el nombre o correo:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.post('/api/blobAImagen', upload.single('imagen'), async (req, res) => {
    try {
        const imagenBase64 = await database.convertirBlobImagen(req.session.id_usuario);

        if (!imagenBase64) {
            return res.status(404).json({ error: 'No se encontró una imagen para este usuario.' });
        }

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
        res.json({ message: 'Descripción del usuario obtenida correctamente', descripcionUsuario });
    } catch (error) {
        console.error('Error al obtener la descripción del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/api/sesiones', async (req, res) => {
    const { periodo } = req.query;
    const idUsuario = req.session.id_usuario;
    if (!idUsuario) {
        return res.status(400).json({ error: 'No se ha encontrado el id_usuario en la sesión' });
    }
    try {
        const sesiones = await database.obtenerSesiones(idUsuario, periodo);
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

app.get('/api/rutinasHechas', async (req, res) => {
    const { periodo } = req.query;
    const idUsuario = req.session.id_usuario;
    if (!idUsuario) {
        return res.status(400).json({ error: 'No se ha encontrado el id_usuario en la sesión' });
    }
    try {
        const rutinasHechas = await database.obtenerRutinasSesiones(idUsuario, periodo);
        res.json(rutinasHechas);
    } catch (error) {
        console.error('Error al obtener rutinasHechas', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


app.get('/api/estadisticas/', async (req, res) => {
    const idUsuario = req.session.id_usuario;
    if (!idUsuario) {
        return res.status(400).json({ error: 'No se ha encontrado el id_usuario en la sesión' });
    }

    try {
        const estadisticas = await database.obtenerEstadisticasSesiones(idUsuario);
        res.json(estadisticas);
    } catch (error) {
        console.error('Error al obtener estadísticas', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Rutas para desafíos
app.post('/api/guardarMeta', async (req, res) => {
    const id_usuario = req.session.id_usuario;
    const { titulo, desc, recompensa } = req.body;

    if (!titulo || !desc || !recompensa) {
        console.error("Datos incompletos:", req.body);
        return res.status(400).json({ message: 'Faltan datos para guardar el desafío.' });
    }
    try {
        const result = await database.guardarMeta({
            titulo,
            desc,
            recompensa,
            id_usuario
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
    const { antiguoTitulo, nuevoTitulo } = req.body;

    try {
        for(let i = 0; i < antiguoTitulo.length; i++) {
            await database.actualizarNumerosMetas({
                antiguoTitulo: antiguoTitulo[i],
                nuevoTitulo: nuevoTitulo[i]
            });
        }
        res.status(201).json({message: 'Desafios actualizados con éxito'});
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
});

app.post('/api/actualizarProgreso', async (req, res) => {
    const { titulo, porcentage } = req.body;
    try {
        await database.actualizarProgreso({
            titulo,
            porcentage,
        });
        res.status(201).json({ message: 'Progreso actualizado con éxito' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
});

app.get('/api/recuperarMetas', async (req, res) => {
    const id_usuario = req.session.id_usuario;
    try {
        const infoDesafios = await database.obtenerDesafios(id_usuario);
        
        res.json(infoDesafios);
    }
    catch (error) {
        console.error('Error al recuperar los desafios', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/fechaDesafioCompletado', async (req, res) => {
    const { fecha } = req.body;
    const id_usuario = req.session.id_usuario;

    try {
        await database.fechaComplecionDesafio({
            fecha,
            id_usuario
        });
        res.status(201).json({ message: 'Fecha añadida con éxito' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
});
app.post('/api/fechasDesafiosABorrar', async (req, res) => {
    const { fecha } = req.body;
    const id_usuario = req.session.id_usuario;

    try {
        await database.fechasABorrar({
            fecha,
            id_usuario
        });
        res.status(201).json({ message: 'Fechas borradas con éxito' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
});
app.get('/api/historialDesafiosCompletados', async (req, res) => {
    const id_usuario = req.session.id_usuario;
    try {
        const fechas = await database.desafiosCompletados(id_usuario);
        res.json(fechas);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
});
app.post('/api/annadirDineroDesafio', async (req, res) => {
    const { dinero } = req.body;
    const id_usuario = req.session.id_usuario;
    try {
        await database.annadirDineroDesafio({
            dinero,
            id_usuario
        });
        res.status(201).json({ message: 'Dinero añadido con éxito' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
});
app.get('/api/recuperarDinero', async (req, res) => {
    const id_usuario = req.session.id_usuario;
    try {
        const dinero = await database.recuperarDinero(id_usuario);
        res.json(dinero)
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
});

app.get('/api/obtenerCarro', async (req, res) => {
    const idUsuario = req.session.id_usuario;
    if (!idUsuario) {
        return res.status(400).json({ error: 'El id_usuario no está disponible' });
    }

    try {
        const productos = await database.obtenerProductosCarro(idUsuario);
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.delete('/api/vacioCarro', async (req, res) => {
    const idUsuario = req.session.id_usuario;

    if (!idUsuario) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    try {
        const result = await database.vaciarCarro(idUsuario);

        if (result) {
            res.status(200).json({ message: 'Carro vacío exitosamente' });
        } else {
            res.status(404).json({ message: 'No se encontró el carrito para el usuario' });
        }
    } catch (err) {
        console.error('Error al vaciar el carrito:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

app.post('/api/agregarAlCarro', async (req, res) => {
    const { idArticulo } = req.body;
    const id_usuario = req.session.id_usuario;
    try {
        const result = await database.agregarAlCarro({ idArticulo, id_usuario });
        res.status(201).json({ message: 'Producto añadido al carro', result });
    } catch (error) {
        console.error('Error al añadir producto:', error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
});

app.delete('/api/eliminarDelCarro', async (req, res) => {
    const { idArticulo } = req.body;
    const id_usuario = req.session.id_usuario;
    try {
        const result = await database.eliminarDelCarro({ idArticulo, id_usuario });
        res.status(200).json({ message: 'Producto eliminado del carro', result });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
});

app.get('/api/productos', async (req, res) => {
    try {
        const productos = await database.obtenerProductos();
        for (let producto of productos) {
            const imagenBase64 = await database.convertirBlobImagenArticulo(producto.idArticulo);
            producto.imagenBase64 = imagenBase64;
        }
        res.json(productos);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        res.status(500).json({ error: 'Error interno al cargar los productos' });
    }
});

app.get('/api/mas-vendidos', async (req, res) => {
    try {
        const masVendidos = await database.obtenerMasVendidos();
        for (let producto of masVendidos) {
            const imagenBase64 = await database.convertirBlobImagenArticulo(producto.idArticulo);
            producto.imagenBase64 = imagenBase64;
        }
        res.status(200).json(masVendidos);
    } catch (error) {
        console.error('Error al obtener los productos más vendidos:', error);
        res.status(500).json({ message: 'Error al obtener los productos más vendidos' });
    }
});

app.get('/api/ofertas-actuales', async (req, res) => {
    try {
        const ofertas = await database.obtenerOfertasActuales();
        for (let producto of ofertas) {
            const imagenBase64 = await database.convertirBlobImagenArticulo(producto.idArticulo);
            producto.imagenBase64 = imagenBase64;
        }
        res.status(200).json(ofertas);
    } catch (error) {
        console.error('Error al obtener las ofertas actuales:', error);
        res.status(500).json({ message: 'Error al obtener las ofertas actuales' });
    }
});

app.post('/api/guardarDatosTarjeta', async (req, res) => {
    const { numero_tarjeta, fecha_caducidad, CVV } = req.body;
    const idUsuario = req.session.id_usuario;

    if (!idUsuario) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (!numero_tarjeta || !fecha_caducidad || !CVV) {
        return res.status(400).json({ message: 'Faltan datos de la tarjeta' });
    }

    try {
        const result = await database.guardarDatosTarjeta(idUsuario, numero_tarjeta, fecha_caducidad, CVV);
        res.status(200).json({ message: 'Datos guardados correctamente', result });
    } catch (err) {
        console.error('Error al guardar los datos de la tarjeta:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Nueva versión del endpoint /api/mensajes con JOIN a usuario


app.get('/api/obtenerMensajes', async (req, res) => {
    const { comunidad } = req.query;
    if (!comunidad) {
        console.error('GET /api/mensajes - El nombre de la comunidad es requerido');
        return res.status(400).json({ error: 'El nombre de la comunidad es requerido' });
    }

    try {
        const mensajes = await database.obtenerMensajesComunidad(comunidad);
        res.status(200).json(mensajes);
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/mandarMensaje', async (req, res) => {
    const { contenido, comunidad, id_emisor } = req.body;
    if (!contenido || !comunidad || !id_emisor) {
        console.error('POST /api/mensajes - Contenido, comunidad y emisor son requeridos');
        return res.status(400).json({ error: 'Contenido, comunidad y emisor son requeridos' });
    }

    const dayjs = require('dayjs');

    const fecha = dayjs();
    const hora = fecha.format('HH:mm:ss');
    const fechaHoy = fecha.format('YYYY-MM-DD');

    try {
        await database.agregarMensaje({
            id_emisor,
            receptor: comunidad,
            contenido,
            hora,
            fecha: fechaHoy
        });

        res.status(200).json({ message: 'Mensaje enviado con éxito' });
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).json({ error: 'Error al guardar el mensaje', details: error.message });
    }
});

app.get('/comunidad', (req, res) => {
    if (!req.session.id_usuario) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'src/public/HTML/comunidad.html'));
});

app.get('/api/mi-usuario', async (req, res) => {
    if (!req.session.id_usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    try {
        const user = await database.obtenerUsuarioPorId(req.session.id_usuario);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ id_usuario: user.id_usuario, nombre_usuario: user.nombre_usuario });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/message', asistente.handleMessage);

app.post('/api/pasarAPedido', async (req, res) => {
    const idUsuario = req.session.id_usuario; // Asegúrate de que el usuario esté autenticado

    if (!idUsuario) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    try {
        const result = await database.pasarAPedido(idUsuario); // Llama a la función en `database.js`
        res.status(200).json({ message: 'Pedido procesado correctamente', result });
    } catch (err) {
        console.error('Error al procesar el pedido:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

app.get('/api/obtenerProductos', async (req, res) => {
    const idUsuario = req.session.id_usuario; // Obtener el ID del usuario desde la sesión
    if (!idUsuario) {
        return res.status(401).json({ message: 'Usuario no autenticado.' }); // Asegúrate de manejar usuarios no autenticados
    }
    try {
        const productos = await database.obtenerPedido(idUsuario);
        res.json(productos); // Devolvemos los productos comprados como respuesta
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos comprados.' });
    }
});

app.get('/soporteCliente', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/contacto.html'));
});

//No definido = error.html
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'src/public/HTML/error.html'));
});