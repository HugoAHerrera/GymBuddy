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
    addUser: async (user) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO usuario (nombre_usuario, contraseña, correo) VALUES (?, ?, ?)';
            connection.query(sql, [user.nombre_usuario, user.contraseña, user.correo], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },
};

module.exports = databaseMethods;