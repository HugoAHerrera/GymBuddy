const bcrypt = require('bcrypt');

const encriptarContraseña = async (plainPassword) => {
    const saltRounds = 10;
    return bcrypt.hash(plainPassword, saltRounds);
};

const compararContraseña = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { encriptarContraseña, compararContraseña };
