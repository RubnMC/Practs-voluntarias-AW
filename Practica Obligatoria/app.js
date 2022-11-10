// app.js 
const config = require("./config");
//const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const fs = require("fs");

// Crear un servidor Express.js 
const app = express();

app.use(express.static('public'));
app.use(express.static('images'))

// Crear un pool de conexiones a la base de datos de MySQL 
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia

// Arrancar el servidor 
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    } else {
        console.log('Servidor arrancado en el puerto ${config.port}');
    }
});