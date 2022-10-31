"use strict";
const mysql = require("./node_modules/mysql");
const config = require("./config");
const DAOUsers = require("./DAOUsers");
const DAOTasks = require("./DAOTasks");
// Crear el pool de conexiones
const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});
let daoUser = new DAOUsers(pool);
let daoTask = new DAOTasks(pool);

function prueba (a,b){
    console.log(b);
}

daoTask.getAllTasks("aitor.tilla@ucm.es",prueba);
// Definición de las funciones callback
// Uso de los métodos de las clases DAOUsers y DAOTasks