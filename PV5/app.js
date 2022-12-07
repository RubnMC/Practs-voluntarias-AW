// app.js 
const config = require("./config");
const DAOTasks = require("./javascripts/DAOTasks");
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

// Crear un servidor Express.js 
const app = express();

// Crear un pool de conexiones a la base de datos de MySQL 
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOTasks 
const daoT = new DAOTasks(pool);

//Static public
app.use(express.static('public'));

//Manejador rutas
app.get("/tasks", function(request, response) {
    response.status(200);
    daoT.getAllTasks("steve.curros@ucm.es", function(a, params) {
       console.log(params);
       response.render("tasks.ejs", {tareas: params});
    });
});

// Arrancar el servidor 
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    } else {
        console.log('Servidor arrancado en el puerto ${config.port}');
    }
});