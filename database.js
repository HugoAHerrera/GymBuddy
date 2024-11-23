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

const databaseMethods = {
    getAllUsers: async () => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM gymbuddy.usuario', (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
};

module.exports = databaseMethods;
