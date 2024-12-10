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
            const sqlInsertarUsuario = 'INSERT INTO usuario (nombre_usuario, contraseña, correo) VALUES (?, ?, ?)';
            
            connection.query(sqlInsertarUsuario, [user.nombre_usuario, user.contraseña, user.correo], (err, result) => {
                if (err) return reject(err);
                
                const sqlPonerImagen = 'UPDATE usuario SET imagenes = (SELECT imagenes FROM imagen_default LIMIT 1) WHERE nombre_usuario = ?';
                
                connection.query(sqlPonerImagen, [user.nombre_usuario], (errUpdate, resultUpdate) => {
                    if (errUpdate) return reject(errUpdate);
                    
                    resolve(resultUpdate);
                });
            });
        });
    },
    

    cambiarContraseña: async (user) => {
        return new Promise((resolve, reject) => {
            console.log()
            const sql = 'UPDATE usuario SET contraseña = ? WHERE correo = ?';
            connection.query(sql, [user.contraseña, user.correo], (err, result) => {
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
        });},

    obtenerUsuarioPorId: async (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM usuario WHERE id_usuario = ?';
            connection.query(sql, [id], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);
                resolve(results[0]);
            });
        });
    },

    insertarRutina: async (idUsuario, nombreRutina, ejercicios) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO rutina (id_usuario, categoria, nombre_rutina, personalizada) VALUES (?, ?, ?, ?)';
            
            connection.query(sql, [idUsuario, 'Tus rutinas creadas', nombreRutina, 1], (err, result) => {
                if (err) {
                    return reject(err);
                }
    
                const ejerciciosSinPrefijo = ejercicios.map(ejercicio => ejercicio.replace(/^Ejercicio \d+: /, ''));
            
                const ejercicioNames = ejerciciosSinPrefijo.map(ejercicio => `'${ejercicio}'`).join(", ");
                
                const sqlUpdate = `
                    UPDATE rutina
                    SET lista_ejercicios = (
                        SELECT GROUP_CONCAT(id_ejercicio ORDER BY FIELD(nombre_ejercicio, ${ejercicioNames}))
                        FROM ejercicio
                        WHERE nombre_ejercicio IN (${ejercicioNames})
                    )
                    WHERE nombre_rutina = ?;
                `;

                connection.query(sqlUpdate, [nombreRutina], (errUpdate, resultUpdate) => {
                    if (errUpdate) {
                        return reject(errUpdate);
                    }
    
                    resolve(result);
                });
            });
        });
    },

    actualizarRutina: async (nombreRutina, ejercicios, idRutina) => {
        return new Promise((resolve, reject) => {
            // Actualización de nombre_rutina
            const sql = 'UPDATE rutina SET nombre_rutina = ? WHERE id_rutina = ?';
    
            connection.query(sql, [nombreRutina, idRutina], (err, results) => {
                if (err) {
                    return reject(err);
                }
    
                // Construir la lista de ejercicios en formato adecuado
                const ejercicioNames = ejercicios.map(ejercicio => `'${ejercicio}'`).join(", ");
                
                // Actualización de la lista de ejercicios
                const sqlUpdate = `
                    UPDATE rutina
                    SET lista_ejercicios = (
                        SELECT GROUP_CONCAT(id_ejercicio ORDER BY FIELD(nombre_ejercicio, ${ejercicioNames}))
                        FROM ejercicio
                        WHERE nombre_ejercicio IN (${ejercicioNames})
                    )
                    WHERE id_rutina = ?;
                `;
    
                connection.query(sqlUpdate, [idRutina], (errUpdate, resultUpdate) => {
                    if (errUpdate) {
                        return reject(errUpdate);
                    }
    
                    resolve(resultUpdate);
                });
            });
        });
    },
    
    obtenerRutinas: async (idUsuario) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT categoria, nombre_rutina, lista_ejercicios 
                FROM rutina
                WHERE id_usuario = ? OR id_usuario IS NULL
            `;
            
            connection.query(sql, [idUsuario], (err, results) => {
                if (err) {
                    return reject(err);
                }
    
                const rutinas = results.map(row => ({
                    categoria: row.categoria,
                    nombre: row.nombre_rutina,
                    ejercicios: row.lista_ejercicios 
                        ? row.lista_ejercicios.split(',').map(Number)
                        : [],
                }));
    
                resolve(rutinas);
            });
        });
    },

    obtenerRutinasPersonales: async (idUsuario) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT nombre_rutina FROM rutina WHERE id_usuario = ? OR id_usuario IS NULL AND personalizada = 1`;
            
            connection.query(sql, [idUsuario], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
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

    obtenerSesiones: async (idUsuario, periodo = null) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT id_sesion, id_usuario, id_rutina, tiempo_total, fecha FROM sesion WHERE id_usuario = ?';
            let params = [idUsuario]; // Se pasa idUsuario como parámetro de la consulta
            // Filtrar por periodo si se especifica
            if (periodo) {
                switch (periodo) {
                    case 'semana':
                        // Filtrar por la semana actual (de lunes a domingo)
                        sql += ' AND fecha >= CURDATE() - INTERVAL (WEEKDAY(CURDATE())) DAY AND fecha < CURDATE() + INTERVAL (6 - WEEKDAY(CURDATE())) DAY';
                        break;
                    case 'mes':
                        // Filtrar por el mes actual (del primer día al último día del mes)
                        sql += ' AND MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())';
                        break;
                    case 'año':
                        // Filtrar por el año actual
                        sql += ' AND YEAR(fecha) = YEAR(CURDATE())';
                        break;
                    case 'total':
                        // Seleccionar todos los registros sin filtro adicional
                        sql += ' AND fecha IS NOT NULL';
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
                    idSesion: row.id_sesion,
                    idUsuario: row.id_usuario,
                    idRutina: row.id_rutina,
                    tiempo_total: row.tiempo_total,
                    fecha: row.fecha,
                }));

                resolve(sesiones);
            });
        });
    },

    obtenerRutinasSesiones: async (idUsuario, periodo = null) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT rutina.id_rutina, rutina.nombre_rutina, COUNT(sesion.id_sesion) AS total_rutina FROM sesion INNER JOIN rutina ON sesion.id_rutina = rutina.id_rutina WHERE sesion.id_usuario = ? GROUP BY rutina.id_rutina, rutina.nombre_rutina';
            let params = [idUsuario]; // Se pasa idUsuario como parámetro de la consulta
            // Filtrar por periodo si se especifica
            if (periodo) {
                switch (periodo) {
                    case 'semana':
                        // Filtrar por la semana actual (de lunes a domingo)
                        sql += ' AND sesion.fecha >= CURDATE() - INTERVAL (WEEKDAY(CURDATE())) DAY ' +
                            'AND sesion.fecha < CURDATE() + INTERVAL (6 - WEEKDAY(CURDATE())) DAY';
                        break;
                    case 'mes':
                        // Filtrar por el mes actual (del primer día al último día del mes)
                        sql += ' AND MONTH(sesion.fecha) = MONTH(CURDATE()) AND YEAR(sesion.fecha) = YEAR(CURDATE())';
                        break;
                    case 'año':
                        // Filtrar por el año actual
                        sql += ' AND YEAR(sesion.fecha) = YEAR(CURDATE())';
                        break;
                    case 'total':
                        // Seleccionar todos los registros sin filtro adicional
                        sql += ' AND sesion.fecha IS NOT NULL';
                        break;
                    default:
                        return reject(new Error('Periodo no válido'));
                }
            }
            // Ejecutar la consulta
            connection.query(sql, params, (err, results) => {
                if (err) return reject(err);
                const rutinas = results.map(row => ({
                    nombre_rutina: row.nombre_rutina,
                    total_rutina: row.total_rutina
                }));

                resolve(rutinas);
            });
        });
    },

    obtenerEstadisticasSesiones: async (idUsuario) => {
        console.log('idUsuario:', idUsuario);
        return new Promise((resolve, reject) => {
            // Consulta SQL para obtener las estadísticas filtrando por id_usuario
            const sql = 'SELECT COUNT(*) AS sesiones_completadas, SUM(tiempo_total) AS tiempoTotal, MAX(fecha) AS ultima_sesion FROM sesion WHERE id_usuario = ?';
            connection.query(sql, [idUsuario], (err, results) => {  // Se pasa el idUsuario como parámetro
                if (err) return reject(err);

                const estadisticas = {
                    sesionesCompletadas: results[0].sesiones_completadas || 0,
                    distanciaRecorrida: parseFloat(results[0].tiempoTotal || 0),
                    ultimaSesion: results[0].ultima_sesion || 'Nunca',
                };
                resolve(estadisticas);
            });
        });
    },

    obtenerCategoriaTodosEjercicio: async () => {
        return new Promise((resolve, reject) => {
            // Consulta SQL parametrizada
            const sql = `
                SELECT categoria, lista_ejercicios FROM gymbuddy.rutina WHERE categoria != 'tus rutinas creadas';`;
            // Ejecutar la consulta SQL usando el conector de la base de datos (mysql2, por ejemplo)
            connection.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },
    

    obtenerIDNombreDificultadTodosEjercicio: async () => {
        return new Promise((resolve, reject) => {
            // Definir la consulta SQL con el parámetro id_ejercicio
            const sql = 'SELECT id_ejercicio,nombre_ejercicio, dificultad FROM ejercicio';
    
            // Ejecutar la consulta SQL pasando el parámetro
            connection.query(sql, (err, results) => {
                if (err) {
                    reject(err); // Si ocurre un error, rechaza la promesa
                } else {
                    resolve(results); // Si la consulta es exitosa, resuelve la promesa con los resultados
                }
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
    obtenerDesafios: async (desafio) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM desafios WHERE id_usuario = ?';
            connection.query(sql, [desafio], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    // actualizar el progreso del desafio
    actualizarProgreso: async (desafio) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE desafios SET progreso = ? WHERE titulo_desafio = ?';
            connection.query(sql, [desafio.porcentage, desafio.titulo], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    fechaComplecionDesafio: async (desafio) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO desafiosreclamados (fecha, id_usuario) VALUES (?, ?)';
            connection.query(sql, [desafio.fecha, desafio.id_usuario], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    fechasABorrar: async (desafio) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM desafiosreclamados WHERE fecha = ? and id_usuario = ?';
            connection.query(sql, [desafio.fecha, desafio.id_usuario], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    desafiosCompletados: async (desafio) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT fecha FROM desafiosreclamados WHERE id_usuario = ?';
            connection.query(sql, [desafio], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    annadirDineroDesafio: async (desafio) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE usuario SET KC = ? WHERE id_usuario = ?';
            connection.query(sql, [desafio.dinero, desafio.id_usuario], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    recuperarDinero: async (desafio) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT KC FROM usuario WHERE id_usuario = ?';
            connection.query(sql, [desafio], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    // GUÍA DE EJERCICIOS
    obtenerDescripcionEjercicios: async (nombreEjercicio) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ejercicio WHERE nombre_ejercicio = ?';
            connection.query(sql, [nombreEjercicio], (err, results) => {
                if (err) return reject(err);
    
                if (results.length === 0) {
                    return reject('Ejercicio no encontrado');
                }
    
                const ejercicio = results[0];
                const descripcion = {
                    id_ejercicio: ejercicio.id_ejercicio,
                    nombre_ejercicio: ejercicio.nombre_ejercicio,
                    dificultad: ejercicio.dificultad,
                    imagen: ejercicio.imagen,
                    equipo_necesario: ejercicio.equipo_necesario,
                    objetivo: ejercicio.objetivo,
                    preparacion: ejercicio.preparacion,
                    ejecucion: ejercicio.ejecucion,
                    consejos_clave: ejercicio.consejos_clave,
                    zona_principal: ejercicio.zona_principal,
                };
    
                resolve(descripcion);
            });
        });
    },
    
    // Función para añadir o actualizar la imagen de un ejercicio dado un id_ejercicio manual
    añadirFotoEjercicio: async (idEjercicio, blob) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE ejercicio SET imagen = ? WHERE id_ejercicio = ?';
                connection.query(sql, [blob, idEjercicio], (err, result) => {
                    if (err) {
                        console.error('Error al actualizar la base de datos:', err);
                        return res.status(500).send('Error al actualizar la imagen.');
                    }

                    // Verifica si se actualizó alguna fila
                    if (result.affectedRows === 0) {
                        return res.status(404).send('No se encontró el ejercicio con el ID proporcionado.');
                    }

                    resolve('Imagen actualizada exitosamente.');
                });
        });
    },

    //Articulo
    añadirFotoArticulo: async (idArticulo, blob) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE tienda SET imagenArticulo = ? WHERE idArticulo = ?';
            
            connection.query(sql, [blob, idArticulo], (err, result) => {
                if (err) {
                    console.error('Error al actualizar la base de datos:', err);
                    return reject('Error al actualizar la imagen.');
                }
    
                // Verifica si se actualizó alguna fila
                if (result.affectedRows === 0) {
                    return reject('No se encontró el artículo con el ID proporcionado.');
                }
    
                resolve('Imagen actualizada exitosamente.');
            });
        });
    },
    

    // PERFIL
    // 
    obtenertiempoEjercicio: async (idUsuario) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT SUM(tiempo_total) AS total_tiempo FROM gymbuddy.sesion WHERE id_usuario = ?'
            connection.query(sql, [idUsuario], (err, results) => {
                    try {
        
                        resolve(results);
                    } catch (error) {
                        reject(error);
                    }
                });
        });
    },

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
    
    // Usuario
    convertirBlobImagen: async (idUsuario) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT imagenes FROM usuario WHERE id_usuario = ?';
    
            connection.query(sql, [idUsuario], (err, results) => {
                if (err) {
                    return reject(err);
                }
    
                if (results.length === 0 || !results[0].imagenes) {
                    return reject(new Error('No se encontró ninguna imagen para este usuario.'));
                }
    
                try {
                    const blob = results[0].imagenes;
    
                    const base64Image = `data:image/jpeg;base64,${blob.toString('base64')}`;
    
                    resolve(base64Image);
                } catch (error) {
                    reject(error);
                }
            });
        });
    },

    obtenerIdRutina: async (nombre_rutina) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id_rutina FROM rutina WHERE nombre_rutina = ? AND categoria = "Tus rutinas creadas"';
            
            connection.query(sql, [nombre_rutina], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0].id_rutina); 
                    } else {
                        reject('No se encontró la rutina'); 
                    }
                }
            });
        });
    },      

    //Ejercicio
    convertirBlobImagenEj: async (nombre_ejercicio) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT imagen FROM ejercicio WHERE nombre_ejercicio = ?';
    
            connection.query(sql, [nombre_ejercicio], (err, results) => {
                if (err) {
                    return reject(err); 
                }
    
                if (results.length === 0 || !results[0].imagen) {
                    // Si no se encuentra la imagen o la columna imagen es NULL, devolver la imagen por defecto
                    return resolve('../Imagenes/curl_pesas.png');  // Ruta de la imagen por defecto
                }
    
                try {
                    const blob = results[0].imagen;
    
                    // Convertir el blob a base64
                    const base64Image = `data:image/jpeg;base64,${blob.toString('base64')}`;
    
                    resolve(base64Image);
                } catch (error) {
                    reject(error);
                }
            });
        });
    },
    
    convertirBlobImagenArticulo: async (idArticulo) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT imagenArticulo FROM tienda WHERE idArticulo = ?';
    
            connection.query(sql, [idArticulo], (err, results) => {
                if (err) {
                    return reject(err);
                }
    
                // Si no hay resultados o la columna `imagenArticulo` es NULL
                if (results.length === 0 || !results[0].imagenArticulo) {
                    return resolve(null); // No devolvemos una imagen por defecto
                }
    
                try {
                    const blob = results[0].imagenArticulo;
    
                    // Convertimos el blob a base64
                    const base64Image = `data:image/jpeg;base64,${blob.toString('base64')}`;
    
                    resolve(base64Image);
                } catch (error) {
                    reject(error);
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
                ORDER BY m.fecha DESC , m.hora DESC 
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
            const sql = `
                INSERT INTO carro (idArticulo, id_usuario, cantidad)
                VALUES (?, ?, 1)
                ON DUPLICATE KEY UPDATE cantidad = cantidad + 1;
            `;
            connection.query(sql, [idArticulo, id_usuario], (err, results) => {
                if (err) return reject(err);
                resolve(results); // Devuelve el resultado de la operación
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
    // Función para obtener los productos del carrito desde la base de datos
    obtenerProductosCarro: async (idUsuario) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT tienda.idArticulo, tienda.nombreArticulo, tienda.precio, tienda.imagenArticulo, tienda.descuentoArticulo, cantidad FROM carro JOIN tienda ON carro.idArticulo = tienda.idArticulo WHERE carro.id_usuario = ?`;
            connection.query(sql, [idUsuario], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    pasarAPedido: async (idUsuario) => {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO pedido (id_usuario, idArticulo, cantidad)
                SELECT id_usuario, idArticulo, cantidad
                FROM carro
                WHERE id_usuario = ?;
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
                resolve(results);
            });
        });
    },

    guardarSesion: async (idUsuario, nombreRutina, tiempoTotal, fecha) => {
        return new Promise((resolve, reject) => {
            const sqlRutina = 'SELECT id_rutina FROM rutina WHERE nombre_rutina = ?';
            
            connection.query(sqlRutina, [nombreRutina], (err, results) => {
                if (err) {
                    console.error('Error en la consulta SELECT:', err);
                    return reject(err);
                }
                if (results.length === 0) {
                    console.error('Rutina no encontrada');
                    return reject(new Error('Rutina no encontrada'));
                }
                
                const idRutina = results[0].id_rutina;
    
                const sqlSesion = `
                    INSERT INTO sesion (id_usuario, id_rutina, tiempo_total, fecha)
                    VALUES (?, ?, ?, ?)
                `;
                
                connection.query(sqlSesion, [idUsuario, idRutina, tiempoTotal, fecha], (err, results) => {
                    if (err) {
                        console.error('Error en la consulta INSERT:', err);
                        return reject(err);
                    }
                    resolve(results);
                });
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
    },

    obtenerMasVendidos: async () => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * 
                FROM tienda
                ORDER BY unidadesVendidas DESC
                LIMIT 3`;
            connection.query(sql, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    obtenerOfertasActuales: async () => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * 
                FROM tienda
                ORDER BY descuentoArticulo DESC
                LIMIT 3`;
            connection.query(sql, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    
    // Función para guardar los datos de la tarjeta en la base de datos
    guardarDatosTarjeta: async (idUsuario, numeroTarjeta, fechaCaducidad, CVV) => {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE usuario SET numero_tarjeta = ?, fecha_caducidad = ?, CVV = ? WHERE id_usuario = ?`;
            connection.query(sql, [numeroTarjeta, fechaCaducidad, CVV, idUsuario], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    obtenerPedido: async (idUsuario) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT tienda.nombreArticulo AS nombreProducto, tienda.descuentoArticulo AS descuento, tienda.precio AS precio, cantidad
                FROM pedido
                JOIN tienda ON pedido.idArticulo = tienda.idArticulo
                WHERE pedido.id_usuario = ?;`;
            connection.query(sql, [idUsuario], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    obtenerMensajesComunidad: async (comunidad) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT m.*, u.nombre_usuario 
                FROM mensajes m
                JOIN usuario u ON m.id_emisor = u.id_usuario
                WHERE m.receptor = ?
                ORDER BY m.fecha DESC, m.hora DESC
            `;
            connection.query(sql, [comunidad], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },


};

module.exports = databaseMethods;
