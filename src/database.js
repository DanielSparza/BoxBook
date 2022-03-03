const mysql = require("mysql");
const { promisify } = require("util");

const { database } = require("./keys.js");

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err){
        if (err.code === "PROTOCOL_CONNECTION_LOST"){
            console.error("SE CERRÓ LA CONEXIÓN A LA BASE DE DATOS");
        }
        if (err.code === "ER_CON_COUNT_ERROR"){
            console.error("LA BASE DE DATOS TIENE DEMASIADAS CONEXIONES");
        }
        if (err.code === "ECONNREFUSED"){
            console.error("LA CONEXIÓN A LA BASE DE DATOS FUE RECHAZADA");
        }
    }

    if (connection) connection.release();{
        console.log("LA BASE DE DATOS ESTÁ CONECTADA")
    }
    return;
});

//Promisify pool query
pool.query =  promisify(pool.query);
module.exports = pool;