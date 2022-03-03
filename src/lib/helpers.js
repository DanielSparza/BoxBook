const bcrypt = require("bcryptjs");

const helpers = {};

//metodo para registrar la contraseña en la BD
helpers.encriptarContrasena = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

//metodo para comparar la contraseña al hacer login
helpers.compararContrasena = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error);
    }   
};

module.exports = helpers;