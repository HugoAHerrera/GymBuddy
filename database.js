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

    obtenerSesiones: async (periodo = null) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT tiempo_ejecucion, repeticiones, sets, kilometros, kg, fecha FROM sesion';
            let params = [];

            // Filtrar por periodo si se especifica
            if (periodo) {
                switch (periodo) {
                    case 'semana':
                        // Filtrar por la semana actual (de lunes a domingo)
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
            const sql = 'INSERT INTO desafios (descripcion, recompensa, titulo_desafio) VALUES (?, ?, ?)';
            connection.query(sql, [desafio.desc, desafio.recompensa, desafio.titulo], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    borrarMeta: async (desafio) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE * FROM desafios WHERE titulo_desafio = ?';
            connection.query(sql, [desafio.titulo], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    actualizarNumerosMetas: async (desafio) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE desafios SET progreso = ? WHERE titulo_desafio = ?';
            connection.query(sql, [desafio.titulo], (err, results) => {
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
            const sql = 'UPDATE desafios SET progreso = ? WHERE titulo_desafio = ?';
            connection.query(sql, [desafio.titulo], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
};

module.exports = databaseMethods;
