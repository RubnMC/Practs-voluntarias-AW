// app.js 

const config = require("./config");
//const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const fs = require("fs");
const { response } = require("express");
const bodyParser = require("body-parser");
const { request } = require("http");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");

// Imports de SA's
const SAUsuario = require("./public/javascripts/SA/SAUsuario");

//Sesiones
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(config.mysqlConfig);
const middelwareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

// Crear un servidor Express.js 
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(middelwareSession);

// Crear un pool de conexiones a la base de datos de MySQL 
const pool = mysql.createPool(config.mysqlConfig);
const saUsuario = new SAUsuario(pool);

//Manejadores de ruta

//Login
app.get("/login", function (request, response) {
    response.status(200);
    response.render("login.ejs", { error: null });
});

app.post("/process_login", function (request, response) {
    //console.log(request.body);  
    let res = saUsuario.usurioCorrecto(request.body, function (err, res) {
        if (err) {
            response.status(500);
            response.render("login", { error: error });
        } else {
            if (res) {
                request.session.currentUser = request.body.email;

                let usuario = res;
                if(res.rol === "Usuario"){
                    response.render("vistaUsuario", usuario);
                } else{
                    response.render("vistaTecnico", usuario);
                }
                
            } else {
                response.status(200);
                response.render("login", { error: "La contraseña o el correo son erroneos" })
            }
        }

    });
})

//Registro
app.get("/singup", function (request, response) {
    response.status(200);
    response.render("singup.ejs");
});

app.post("/process_singup", function (request, response) {
    //console.log(request.body);
    try {
        let res = saUsuario.crearUsuario(request.body);
        console.log(res);
    } catch (error) {
        console.log(error.message);
    }
    response.end();
})

//Usuario
app.get("/user", function (request, response) {
    response.status(200);
    response.render("vistaUsuario.ejs");
});

app.get("/tech", function (request, response) {
    response.status(200);
    response.render("vistaTecnico.ejs");
});

app.get("/c", function (request, response) {  //TODO: esto se borrará cuando no sea necesario
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