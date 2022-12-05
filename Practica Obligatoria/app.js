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
const SAAvisos = require("./public/javascripts/SA/SAAvisos");
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
const saUsuario = new SAUsuario(pool);
const saAvisos = new SAAvisos(pool);


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

//Registro
app.get("/singup", function (request, response) {
    response.status(200);
    response.render("singup.ejs", { error: null });
});

app.post("/process_singup", function (request, response) {

    saUsuario.crearUsuario(request.body, function (err, res) {
        if (err) {
            response.status(200);
            console.log(err);
            response.render("singup", { error: err });
        } else {
            if (res) {
                response.status(200);
                response.render("login", { error: null });
            } else {
                response.status(200);
                response.render("singup.ejs", { error: null });
            }
        }
    });
})

app.post("/process_login", function (request, response) {
    saUsuario.usuarioCorrecto(request.body, function (err, res) {
        if (err) {
            response.status(500);
            response.render("login", { error: err });
        } else {
            if (res) {
                request.session.currentUser = res;

                response.status(200);
                if (res.rol === "Usuario") {
                    response.redirect("logged_user");
                } else {
                    response.redirect("logged_tec");
                }

            } else {
                response.status(200);
                response.render("login.ejs", { error: "La contraseña o el correo son erroneos" })
            }
        }

    });
})

//Usuario
app.get("/logged_user", auth, function (request, response) {
    response.status(200);

    saAvisos.getAvisos(request.session.currentUser, function (err, res) {
        if (err) {
            response.status(500);
            console.log(err);
        } else {
            response.status(200);
            request.session.currentUser.avisos = res;
            switch (request.session.currentUser.perfilUniversitario) {
                case "A":
                    fs.readFile("./public/resources/avisosA.json", function (error, content) {
                        if (!error) {
                            response.locals.tiposAvisos = JSON.parse(content);
                            response.render("vistaUsuario.ejs", request.session.currentUser);
                        }
                        else {
                            console.log(error);
                        }
                    })
                    break;
                case "AA":
                    fs.readFile("./public/resources/avisosAA.json", function (error, content) {
                        if (!error) {
                            response.locals.tiposAvisos = JSON.parse(content);
                            response.render("vistaUsuario.ejs", request.session.currentUser);
                        }
                        else {
                            console.log(error);
                        }
                    })
                    break;
                case "PAS":
                    fs.readFile("./public/resources/avisosPAS.json", function (error, content) {
                        if (!error) {
                            response.locals.tiposAvisos = JSON.parse(content);
                            response.render("vistaUsuario.ejs", request.session.currentUser);
                        }
                        else {
                            console.log(error);
                        }
                    })
                    break;
                case "PDI":
                    fs.readFile("./public/resources/avisosPDI.json", function (error, content) {
                        if (!error) {
                            response.locals.tiposAvisos = JSON.parse(content);
                            response.render("vistaUsuario.ejs", request.session.currentUser);
                        }
                        else {
                            console.log(error);
                        }
                    })
                    break;
                default:
                    break;
            }
        }
    })
});

app.get("/logged_tec", auth, function (request, response) {
    response.status(200);
    response.render("vistaTecnico.ejs", request.session.currentUser);
});

//Avisos
app.post("/process_aviso", function (request, response) {

    saAvisos.crearAviso(request.body, request.session.currentUser.idUsuario, function (err, res) {
        if (err) {
            response.status(500);
            console.log("Error Base Datos");
            //response.render("login", { error: err });
        } else {
            if (res) {
                response.status(200);
                response.redirect("logged_user");

            } else {
                response.status(200);
                console.log("Error al crear");
                response.redirect("logged_user");
            }
        }
    });
})

// Arrancar el servidor 
app.listen(config.portS, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    } else {
        console.log('Servidor arrancado en el puerto ${config.port}');
    }
});