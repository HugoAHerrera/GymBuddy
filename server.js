
const express = require('express');
const path = require('path');
require('dotenv').config();
const database = require('./database');
const { encriptarContraseña, compararContraseña } = require('./encryptor');
const session = require('express-session');
 
const multer = require('multer');
const upload = multer(); // Configuración básica para manejar multipart/form-data

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



//Redirecciones del header
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
    res.sendFile(path.join(__dirname, 'src/public/HTML/Progreso.html'));
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
        const guia = await database.obtenerDescripcionEjercicios(58);
        console.log(guia); // Asumiendo que quieres imprimir la respuesta en la consola.
        res.status(200).json(guia); // Enviar la respuesta al cliente
    } catch (error) {
        console.error('Error al obtener la guía de ejercicios:', error); // Se añadió el parámetro `error`
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.post('/api/blobAImagenEjercicio', upload.single('imagen'), async (req, res) => {
    try {
        const imagenBase64 = await database.convertirBlobImagenEj(58);

        if (!imagenBase64) {
            return res.status(404).json({ error: 'No se encontró una imagen para este usuario.' });
        }

        res.status(200).json({ imagen: imagenBase64 });
    } catch (error) {
        console.error("Error al convertir el blob a imagen ejercoco:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


app.get('/previewTerminosCondiciones', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/HTML/noUserTerminosCondiciones.html'));
  });

  

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
  
app.get('/perfil', (req, res) => {
    if (!req.session.id_usuario) {
        return res.status(400).send('ID de usuario no proporcionado');
    }
    console.log('Perfil:',req.session.id_usuario)
    res.sendFile(path.join(__dirname, 'src/public/HTML/guia_ejercicios.html'));
});

app.post('/api/cambiarNombreUsuario', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre_usuario, correo_usuario } = req.body;
        const imagen = req.file; // Acceder al archivo de imagen

        //console.log("imagen:", imagen ? imagen.buffer : "No se proporcionó imagen.");

        // Comprobamos la existencia del usuario y del correo
        const usuarioExistente = await database.comprobarUsuarioExistente(nombre_usuario);
        const correoExistente = await database.comprobarCorreoExistente(correo_usuario);
        console.log("a:",usuarioExistente,"b:",correoExistente)
        // Validar si el nombre de usuario ya está en uso
        if (usuarioExistente == false || correoExistente == false ){
            return res.status(400).json({ error: 'Los campos Nombre Usuario y Mail Asociado son obligatorios' });
        }
        if (usuarioExistente && usuarioExistente.id !== req.session.id_usuario) {
            if (correoExistente && correoExistente.id !== req.session.id_usuario) {
                if(imagen){
                    await database.añadirFotoPerfil(req.session.id_usuario, imagen.buffer);
                    return res.status(400).json({ error: 'Usuario o/y Correo asociados a una cuenta. Foto Cambiada.' });
                } else {
                    return res.status(400).json({ error: 'Usuario o/y Correo asociados a una cuenta. Foto no Cambiada."'});
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
        // Simulamos que estamos obteniendo datos de la base de datos usando el ID del usuario en la sesión
        const datosUsuario = await database.obtenerDatosUsuario(req.session.id_usuario);

        // Devuelve los datos del usuario al cliente
        //console.log("[Nombre,Correo,Imagen]:", datosUsuario.nombre_usuario, datosUsuario.correo, datosUsuario.imagenes)
        //const imagenes = await database.convertirBlobImagen(req.session.id_usuario)
        //console.log("[Nombre,Correo,Imagen]:", datosUsuario.nombre_usuario, datosUsuario.correo, imagenes)
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


app.post('/api/guardarMeta', async (req, res) => {
    console.log("Datos recibidos:", req.body);
     id_usuario = req.session.id_usuario;

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

app.get('/api/carro', async (req, res) => {
    const { idUsuario } = req.params;
    try {
        const productos = await database.obtenerProductosCarro(idUsuario);
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos de la carro', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.delete('/api/carro', async (req, res) => {
    const { idUsuario } = req.params;
    try {
        const exito = await database.vaciarCarro(idUsuario);
        if (exito) {
            res.json({ mensaje: 'carro vaciado correctamente' });
        } else {
            res.status(400).json({ mensaje: 'No se pudo vaciar la carro' });
        }
    } catch (error) {
        console.error('Error al vaciar la carro', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/agregarAlCarro', async (req, res) => {
    const { idArticulo, id_usuario } = req.body;
    try {
        const result = await database.agregarAlCarro({ idArticulo, id_usuario });
        res.status(201).json({ message: 'Producto añadido al carro', result });
    } catch (error) {
        console.error('Error al añadir producto:', error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
});

app.delete('/api/eliminarDelCarro', async (req, res) => {
    const { idArticulo, id_usuario } = req.body;
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
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
});