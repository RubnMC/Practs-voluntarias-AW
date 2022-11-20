// app.js 
const config = require("./config");
//const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const fs = require("fs");
const { response } = require("express");

// Crear un servidor Express.js 
const app = express();

app.use(express.static('public'));

// Crear un pool de conexiones a la base de datos de MySQL 
const pool = mysql.createPool(config.mysqlConfig);

//Manejadores de ruta

//Login
app.get("/login", function(request, response) {
    response.status(200);
    response.render("login.ejs");
});

//Registro
app.get("/singup", function(request, response) {
    response.status(200);
    response.render("singup.ejs");
});

//Usuario
app.get("/user", function(request, response) {
    response.status(200);
    response.render("vistaUsuario.ejs");
});

app.get("/tech", function(request, response) {
    response.status(200);
    response.render("vistaTecnico.ejs");
});

app.get("/c", function(request, response) {  //TODO: esto se borrará cuando no sea necesario
    response.status(200);
    response.render("subplantillas/cabecera.ejs");
});

// Arrancar el servidor 
app.listen(config.portS, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    } else {
        console.log('Servidor arrancado en el puerto ${config.port}');
    }
});