// app.js 
const config = require("./config");
const DAOTasks = require("./javascripts/DAOTasks");
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { request } = require("http");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");

const { nextTick } = require("process");

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

app.use(express.static('views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(middelwareSession);


// Crear un pool de conexiones a la base de datos de MySQL 
const pool = mysql.createPool(config.mysqlConfig);
const daoT = new DAOTasks(pool);


function auth(request, response, next) {
    if (request.session.currentUser) {
        next();
    }
    else {
        response.redirect("login");
    }
}

//Manejadores de ruta
//Login
app.get("/", function (request, response) {
    response.status(200);
    response.redirect("login");
});

app.get("/login", function (request, response) {
    response.status(200);
    response.render("login.ejs", { error: null });
});

app.get("/logout", auth, function (request, response) {
    request.session.destroy();
    response.redirect("login");
});

app.post("/process_login", function (request, response) {

    //TODO
    usuarioCorrecto(request.body, function (err, res) {
        if (err) {
            response.status(500);
            response.render("login", { error: err });
        } else {
            if (res) {
                request.session.currentUser = res;
                response.status(200);

            } else {
                response.status(200);
                response.render("login.ejs", { error: "La contraseña o el correo son erroneos" })
            }
        }

    });
})

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