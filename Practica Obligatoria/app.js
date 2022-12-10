// app.js 

const config = require("./config");
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const fs = require("fs");
const { response } = require("express");
const bodyParser = require("body-parser");
const { request } = require("http");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const multer = require("multer");

// Imports de SA's
const SAUsuario = require("./public/javascripts/SA/SAUsuario");
const SAAvisos = require("./public/javascripts/SA/SAAvisos");
const { nextTick } = require("process");
const { render } = require("express/lib/response");

//Sesiones
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(config.mysqlConfig);
const middelwareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

//Multer
const multerFactory = multer({ storage: multer.memoryStorage() });

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

//Registro
app.get("/singup", function (request, response) {
    response.status(200);
    response.render("singup.ejs", { error: null });
});

app.post("/process_singup", function (request, response) {

    saUsuario.crearUsuario(request.body, function (err, res) {
        if (err) {
            response.status(500);
            response.render("singup.ejs", { error: err });
        } else {
            if (res) {
                response.status(200);
                response.redirect("login");
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
app.get("/logged_user", utils.auth, utils.getTiposAvisos, function (request, response) {
    response.status(200);

    saAvisos.getAvisos(request.session.currentUser, false, function (err, res) {
        if (err) {
            response.status(500);
            console.log(err);
        } else {
            response.status(200);
            response.render("vistaUsuario.ejs", { avisos: res });
        }
    })
});

app.get("/logged_tec", utils.auth, function (request, response) {
    response.status(200);

    saAvisos.getAvisosTecnico(request.session.currentUser, 1, function (err, res) {
        if (err) {
            response.status(500);
            console.log(err);
        } else {
            response.status(200);
            response.render("vistaTecnico.ejs", { avisos: res });
        }
    })
});

//Avisos
app.post("/process_aviso", utils.auth, function (request, response) {

    saAvisos.crearAviso(request.body, request.session.currentUser.idUsuario, function (err, res) {
        if (err) {
            response.status(500);
            console.log("Error Base Datos");
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

app.get("/historicosuser", utils.auth, utils.getTiposAvisos, function (request, response) {
    saAvisos.getAvisos(response.locals.currentUser, true, function (err, res) {
        if (err) {
            response.status(500);
            console.log(err);
        } else {
            response.render("vistaUsuarioHist.ejs", { avisos: res });
        }
    });
});

//Manejadores tecnico
app.get("/misavisos", utils.auth, utils.getTiposAvisos, function (request, response) {
    saAvisos.getAvisosTecnico(request.session.currentUser, 2, function (err, res) {
        if (err) {
            response.status(500);
            console.log(err);
        } else {
            response.status(200);
            response.render("vistaTecnicoMisAvisos.ejs", { avisos: res });
        }
    })
});

app.get("/historicostec", utils.auth, utils.getTiposAvisos, function (request, response) {
    saAvisos.getAvisosTecnico(request.session.currentUser, 3, function (err, res) {
        if (err) {
            response.status(500);
            console.log(err);
        } else {
            response.status(200);
            response.render("vistaTecnicoHist.ejs", { avisos: res });
        }
    })
});

app.get("/prueba", utils.auth, function (request, response) {
    response.render("subplantillas/modalAsignarTec.ejs");
});

//AJAX
app.get("/aviso/:idAviso", function (request, response) {

    saAvisos.getInfoAviso(request.params.idAviso, function (err, res) {
        if (err) {
            response.status(500);
            console.log(err);
        } else {
            response.status(200);
            response.json({ aviso: res });
        }
    });
    
});

app.get("/tecnicos", function (request, response) {

    saUsuario.getAllTecnicos(function (err, res) {
        if (err) {
            response.status(500);
            console.log(err);
        } else {
            response.status(200);
            response.json({ tecnicos: res });
        }
    });
    
});

app.post("/asignarTecnico", utils.auth, function (request, response) {


    console.log(request.body);

    saAvisos.asignarTecnico(request.body.idAvisoAsignado, request.body.tecnicoAsignado, function (err, res) {
        if (err) {
            response.status(500);
            console.log(err);
        } else {
            if (res) {
                response.status(200);
                response.redirect("logged_tec");

            } else {
                response.status(200);
                console.log("Error al crear");
                response.redirect("logged_tec");
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