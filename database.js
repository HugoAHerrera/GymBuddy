const mysql = require('mysql2'); 
require('dotenv').config();

const connection = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USUARIO, 
    password: process.env.DB_CONTRA, 
    database: process.env.DB_NOMBRE,
    port: process.env.DB_PUERTO,
});

connection.getConnection((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos MySQL en Azure');
    }
});

//Aqui añadir los métodos que necesiteis sobre la BBDD
const databaseMethods = {
    comprobarUsuarioExistente: async (nombre_usuario) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM usuario WHERE nombre_usuario = ?';
            connection.query(sql, [nombre_usuario], (err, results) => {
                if (err) return reject(err);
                resolve(results.length > 0);//True o False si está usado el usuario
            });
        });
    },

    comprobarCorreoExistente: async (correo) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM usuario WHERE correo = ?';
            connection.query(sql, [correo], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.length > 0) {
                    return resolve(true); // El correo ya está en uso
                }
                return resolve(false); // El correo no está en uso
            });
        });
    },

    registrarUsuario: async (user) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO usuario (nombre_usuario, contraseña, correo) VALUES (?, ?, ?)';
            connection.query(sql, [user.nombre_usuario, user.contraseña, user.correo], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    comprobarCredenciales: async (email) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM usuario WHERE correo = ?';
            connection.query(sql, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },

    obtenerRutinas: async () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT categoria, nombre_rutina, lista_ejercicios FROM rutina';
            connection.query(sql, (err, results) => {
                if (err) return reject(err);

                const rutinas = results.map(row => ({
                    categoria: row.categoria,
                    nombre: row.nombre_rutina,
                    ejercicios: row.lista_ejercicios.split(',').map(Number),
                }));

                resolve(rutinas);
            });
        });
    },

    obtenerEjercicios: async (rutinaNombre) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT lista_ejercicios FROM rutina WHERE nombre_rutina = ?';
            connection.query(sql, [rutinaNombre], async (err, results) => {
                if (err) return reject(err);
    
                if (results.length === 0) return resolve([]); // Si no se encuentra la rutina
    
                const listaEjercicios = results[0].lista_ejercicios.split(',');
                try {
                    const ejercicios = [];
                    for (const id of listaEjercicios) {
                        const ejercicioSql = 'SELECT nombre_ejercicio FROM ejercicio WHERE id_ejercicio = ?';
                        const [ejercicioResult] = await new Promise((resolve, reject) => {
                            connection.query(ejercicioSql, [id], (err, result) => {
                                if (err) return reject(err);
                                resolve(result);
                            });
                        });
                        ejercicios.push(ejercicioResult.nombre_ejercicio);
                    }
                    resolve(ejercicios);
                } catch (error) {
                    reject(error);
                }
            });
        });
    },

    obtenerSesiones: async (periodo = null) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT tiempo_ejecucion, repeticiones, sets, kilometros, kg, fecha FROM sesion';
            let params = [];

            // Filtrar por periodo si se especifica
            if (periodo) {
                switch (periodo) {
                    case 'semana':
                        // Filtrar por la semana' actual (de lunes a domingo)
                        sql += ' WHERE fecha >= CURDATE() - INTERVAL (WEEKDAY(CURDATE())) DAY AND fecha < CURDATE() + INTERVAL (6 - WEEKDAY(CURDATE())) DAY';
                        break;
                    case 'mes':
                        // Filtrar por el mes actual (del primer día al último día del mes)
                        sql += ' WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())';
                        break;
                    case 'año':
                        // Filtrar por el año actual
                        sql += ' WHERE YEAR(fecha) = YEAR(CURDATE())';
                        break;
                    case 'total':
                        // Seleccionar todos los registros sin filtro
                        sql += ' WHERE fecha IS NOT NULL';
                        break;
                    default:
                        return reject(new Error('Periodo no válido'));
                }
            }

            // Agregar orden por fecha
            sql += ' ORDER BY fecha';

            // Ejecutar la consulta
            connection.query(sql, params, (err, results) => {
                if (err) return reject(err);

                const sesiones = results.map(row => ({
                    tiempo: row.tiempo_ejecucion,
                    repeticiones: row.repeticiones,
                    sets: row.sets,
                    kilometros: row.kilometros,
                    kg: row.kg,
                    fecha: row.fecha,
                }));

                resolve(sesiones);
            });
        });
    },

    obtenerEstadisticasSesiones: async () => {
        return new Promise((resolve, reject) => {
            // Consulta SQL para obtener las estadísticas
            const sql = 'SELECT COUNT(*) AS sesiones_completadas, SUM(kilometros) AS distancia_recorrida, MAX(fecha) AS ultima_sesion FROM sesion';
            connection.query(sql, (err, results) => {
                if (err) return reject(err);

                const estadisticas = {
                    sesionesCompletadas: results[0].sesiones_completadas || 0,
                    distanciaRecorrida: parseFloat(results[0].distancia_recorrida || 0),
                    ultimaSesion: results[0].ultima_sesion || 'Nunca',
                };
                resolve(estadisticas);
            });
        });
    },

    // Metodos para la pagina de Objetivos -- meta al completo (progreso, descripcion, recompensa...)
    // se ejecuta cada vez que cambia de pagina el usuario? -> ver cuando
    guardarMeta: async (desafio) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO desafios (descripcion, recompensa, titulo_desafio, id_usuario) VALUES (?, ?, ?, ?)';
            connection.query(sql, [desafio.desc, desafio.recompensa, desafio.titulo, desafio.id_usuario], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    borrarMeta: async (desafio) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM desafios WHERE titulo_desafio = ?';
            connection.query(sql, [desafio.titulo], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    actualizarNumerosMetas: async (desafio) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE desafios SET titulo_desafio = ? WHERE titulo_desafio = ?';
            connection.query(sql, [desafio.nuevoTitulo, desafio.antiguoTitulo], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    /* Para cargar la pagina de cada user con sus desafios ya existentes */
    obtenerDesafios: async () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM desafios';
            connection.query(sql, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    // actualizar el progreso del desafio
    actualizarProgreso: async (desafio) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE desafios SET progreso = ?, reclamado = ? WHERE titulo_desafio = ?';
            connection.query(sql, [desafio.porcentage, desafio.reclamado, desafio.titulo], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    // GUÍA DE EJERCICIOS
    obtenerDescripcionEjercicios: async (idUsuario) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ejercicio WHERE id_ejercicio = ?';
            connection.query(sql, [idUsuario], (err, results) => {
                if (err) return reject(err);
    
                // Si no hay resultados para ese usuario, retornar un error o un valor vacío.
                if (results.length === 0) {
                    return reject('Usuario no encontrado');
                }
    
                // Aquí asignas las columnas de la tabla 'usuario' a un objeto, por ejemplo:
                const usuario = results[0];
                const descripcion = {
                    id_ejercicio: usuario.id_ejercicio,
                    nombre_ejercicio: usuario.nombre_ejercicio,
                    dificultad: usuario.dificultad,
                    imagen: usuario.imagen,
                    equipo_necesario: usuario.equipo_necesario,
                    objetivo: usuario.objetivo,
                    preparacion: usuario.preparacion,
                    ejecucion: usuario.ejecucion,
                    consejos_clave: usuario.consejos_clave,
                    zona_principal: usuario.zona_principal
                    // Puedes agregar más campos que tengas en la tabla de usuario
                };
    
                resolve(descripcion);
            });
        });
    },
    
    // Función para añadir o actualizar la imagen de un ejercicio dado un id_ejercicio manual
    añadirFotoEjercicio: async (idEjercicio, blob) => {
        return new Promise((resolve, reject) => {
            // Consulta SQL para actualizar la imagen del ejercicio en la base de datos
            const sql = 'UPDATE ejercicio SET imagen = ? WHERE id_ejercicio = ?';
            
            // Ejecutar la consulta SQL con los parámetros
            connection.query(sql, [blob, idEjercicio], (err, results) => {
                if (err) {
                    return reject(err); // Si hay error, lo rechazamos
                }
                resolve(results); // Si todo va bien, resolvemos la promesa con los resultados
            });
        });
    },

    // PERFIL
    cambiarNombreUsuario: async (idUsuario, nuevoNombre) => {
        return new Promise((resolve, reject) => {
            // Asegúrate de que la columna a actualizar sea 'nombre_usuario' y que el valor 'nuevoNombre' se pase correctamente.
            const sql = 'UPDATE usuario SET nombre_usuario = ? WHERE id_usuario = ?';
            
            connection.query(sql, [nuevoNombre, idUsuario], (err, results) => {
                if (err) {
                    return reject(err); // Rechaza la promesa si ocurre un error.
                }
                resolve(results); // Resuelve la promesa con los resultados si no hay error.
            });
        });
    },

    cambiarCorreoUsuario: async (idUsuario, nuevoCorreo) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE usuario SET correo = ? WHERE id_usuario = ?'
            connection.query(sql, [nuevoCorreo, idUsuario], (err,results) => {
                if(err) {
                    return reject(err);
                }
                resolve(results)
            })
        });
    },

    añadirFotoPerfil: async (idUsuario, blob) => {
        return new Promise((resolve, reject) => {
            // Consulta SQL para actualizar la imagen del ejercicio en la base de datos
            const sql = 'UPDATE usuario SET imagenes = ? WHERE id_usuario = ?';
            
            // Ejecutar la consulta SQL con los parámetros
            connection.query(sql, [blob, idUsuario], (err, results) => {
                if (err) {
                    return reject(err); // Si hay error, lo rechazamos
                }
                resolve(results); // Si todo va bien, resolvemos la promesa con los resultados
            });
        });
    },

    convertirBlobImagen: async (idUsuario) => {
        return new Promise((resolve, reject) => {
            // Consulta SQL para obtener la imagen del usuario desde la base de datos
            const sql = 'SELECT imagenes FROM usuario WHERE id_usuario = ?';
    
            // Ejecutar la consulta SQL con el idUsuario como parámetro
            connection.query(sql, [idUsuario], (err, results) => {
                if (err) {
                    return reject(err); // Si hay error, rechazamos la promesa
                }
    
                if (results.length === 0 || !results[0].imagenes) {
                    return reject(new Error('No se encontró ninguna imagen para este usuario.'));
                }
    
                try {
                    // Obtenemos el blob (almacenado como un Buffer en Node.js) de la consulta
                    const blob = results[0].imagenes;
    
                    // Convertir el Buffer a Base64
                    const base64Image = `data:image/jpeg;base64,${blob.toString('base64')}`;
    
                    // Resolvemos con la imagen en formato Base64
                    resolve(base64Image);
                } catch (error) {
                    reject(error); // Rechazamos si ocurre un error durante la conversión
                }
            });
        });
    },
    
    

    obtenerDatosUsuario: async (idUsuario) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM usuario WHERE id_usuario = ?';
            connection.query(sql, [idUsuario], (err, results) => {
                if (err) return reject(err);
    
                // Si no hay resultados para ese usuario, retornar un error o un valor vacío.
                if (results.length === 0) {
                    return reject('Usuario no encontrado');
                }
    
                // Aquí asignas las columnas de la tabla 'usuario' a un objeto, por ejemplo:
                const usuario = results[0];
                const descripcion = {
                    id_usuario: usuario.id_usuario,
                    imagenes: usuario.imagenes,
                    correo: usuario.correo,
                    nombre_usuario: usuario.nombre_usuario,
                    contraseña: usuario.contraseña,
                    KC: usuario.KC,
                    numero_tarjeta: usuario.numero_tarjeta,
                    CVV: usuario.CVV,
                    fecha_caducidad: usuario.fecha_caducidad
                    // Puedes agregar más campos que tengas en la tabla de usuario
                };
    
                resolve(descripcion);
            });
        });
    },

    buscarUsuarios: async (query) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id_usuario, nombre_usuario 
            FROM usuario 
            WHERE nombre_usuario LIKE ? AND id_usuario != ? 
        `;
        const searchQuery = `%${query}%`;
        const userId = 1; // Aquí deberías pasar dinámicamente el ID del usuario actual logueado
        connection.query(sql, [searchQuery, userId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
},


    agregarMensaje: async (mensaje) => {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO mensajes (id_emisor, receptor, contenido, hora, fecha)
                VALUES (?, ?, ?, ?, ?)
            `;
            const params = [
                mensaje.id_emisor,
                mensaje.receptor,
                mensaje.contenido,
                mensaje.hora,
                mensaje.fecha
            ];
            connection.query(sql, params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    // Obtener mensajes de un chat (grupo o persona)
    obtenerMensajes: async (receptor) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT m.id_mensaje, u.nombre_usuario AS emisor, m.receptor, m.contenido, m.hora, m.fecha
                FROM mensajes m
                JOIN usuario u ON m.id_emisor = u.id_usuario
                WHERE m.receptor = ?
                ORDER BY m.fecha ASC, m.hora ASC
            `;
            connection.query(sql, [receptor], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    //Tienda
    agregarAlCarro: async ({ idArticulo, id_usuario }) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO carro (idArticulo, id_usuario) VALUES (?, ?)';
            connection.query(sql, [idArticulo, id_usuario], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    
    eliminarDelCarro: async ({ idArticulo, id_usuario }) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM carro WHERE idArticulo = ? AND id_usuario = ?';
            connection.query(sql, [idArticulo, id_usuario], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    //Carro
    obtenerProductosCarro: async (idUsuario) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT tienda.idArticulo, tienda.nombreArticulo, tienda.precio, tienda.imagenArticulo, tienda.descuentoArticulo
                FROM carro
                JOIN tienda ON carro.idArticulo = tienda.idArticulo
                WHERE carro.id_usuario = ?;
            `;
            connection.query(sql, [idUsuario], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    vaciarCarro: async (idUsuario) => {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM carro WHERE id_usuario = ?;`;
            connection.query(sql, [idUsuario], (err, results) => {
                if (err) return reject(err);
                resolve(results.affectedRows > 0);
            });
        });
    },

    obtenerProductos: async () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM tienda';
            connection.query(sql, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
};

module.exports = databaseMethods;
