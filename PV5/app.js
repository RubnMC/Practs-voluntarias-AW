// app.js 
const config = require("./config");
const DAOTasks = require("./javascripts/DAOTasks");
const DAOUsers = require("./javascripts/DAOUsers");
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
const daoU = new DAOUsers(pool);

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

app.get("/logout", utils.auth, function (request, response) {
    request.session.destroy();
    response.redirect("login");
});

app.post("/process_login", function (request, response) {

    //TODO
    daoU.isUserCorrect(request.body.email, request.body.password, function (err, res) {
        if (err) {
            response.status(500);
            response.render("login", { error: err });
        } else {
            if (res) {
                request.session.currentUser = res;
                response.status(200);
                response.redirect("/tasks");

            } else {
                response.status(200);
                response.render("login.ejs", { error: "La contraseña o el correo son erroneos" })
            }
        }

    });
})

app.get("/tasks", utils.auth, function (request, response) {
    response.status(200);
    daoT.getAllTasks(response.locals.userEmail, function (a, params) {
        if(params){
            params.tareas.forEach(tarea => {
                tarea.tags = params.etiquetas.filter(tag => {
                    return tag.idTarea === tarea.idTarea;
                })
            });
            response.render("tasks.ejs", {tareas: params.tareas});
        }
    });
});

app.get("/imagenUsuario",utils.auth, function (request, response) {
    response.status(200);
    daoU.getUserImage(response.locals.userEmail, function (a, params) {
        if(!params.imagen){
            response.sendFile("/img/profile_imgs/noUser.jpg", {root: "public"});
        }
        else{
            response.sendFile("/img/profile_imgs/"+params.imagen, {root: "public"});
        }
    });
});

app.get("/finish/:taskId",utils.auth, function (request, response) {
    response.status(200);
    daoT.markTaskDone(request.params.taskId, function (a, ok) {
        response.redirect("/tasks");
    });
});

app.get("/deleteCompleted",utils.auth, function (request, response) {
    response.status(200);
    daoT.deleteCompleted(response.locals.userEmail, function (a, ok) {
        response.redirect("/tasks");
    });
});

app.post("/createTask",utils.auth, function (request, response) {
    response.status(200);
    daoT.insertTask(response.locals.userEmail, utils.parseTask(request.body.tarea), function (a, ok) {
        response.redirect("/tasks");
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