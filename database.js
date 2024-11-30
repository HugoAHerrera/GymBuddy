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

    obtenerSesiones: async () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT tiempo_ejecucion, repeticiones, sets, kilometros, kg, fecha FROM sesion';
            connection.query(sql, (err, results) => {
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
                console.log(estadisticas);
            });
        });
    },
};

module.exports = databaseMethods;
