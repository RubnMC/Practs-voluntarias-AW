//router.js
const utils = require("../utils");
const path = require("path");
const mysql = require("mysql");
const fs = require("fs");
const express = require("express");
const { request } = require("http");
const multer = require("multer");
const config = require("../config");

// Imports de SA's
const SAUsuario = require("../public/javascripts/SA/SAUsuario");
const SAAvisos = require("../public/javascripts/SA/SAAvisos");
const { nextTick } = require("process");
const { render } = require("express/lib/response");

// Crear un pool de conexiones a la base de datos de MySQL 
const pool = mysql.createPool(config.mysqlConfig);
const saUsuario = new SAUsuario(pool);
const saAvisos = new SAAvisos(pool);
const router = express.Router();

//Multer
const multerFactory = multer({ storage: multer.memoryStorage() });


//Manejadores de ruta
//Login
router.get("/", function (request, response) {
    response.status(200);
    response.redirect("login");
});

router.get("/login", function (request, response) {
    response.status(200);
    response.render("login.ejs", { error: null });
});

router.get("/logout", utils.auth, function (request, response) {
    request.session.destroy();
    response.redirect("login");
});

//Registro
router.get("/singup", function (request, response) {
    response.status(200);
    response.render("singup.ejs", { error: null });
});

router.post("/process_singup", multerFactory.single('foto'), function (request, response) {
    let tec = false;
    if (request.body.esTecnico === 'ON') {
        tec = true;
    }

    let user = {
        correo: request.body.email,
        rol: tec,
        numTecnico: request.body.numEmpleado,
        nombre: request.body.nombre,
        perfilUniversitario: request.body.profile_type,
        password: request.body.password,
        password_2: request.body.password_2,
        imagen: null,
    };

    if (request.file) {
        user.imagen = request.file.buffer;
    }

    saUsuario.crearUsuario(user, function (err, res) {
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

router.post("/process_login", function (request, response) {
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

router.get("/imagen/:id", utils.auth, function (request, response) {
    let n = Number(request.params.id);
    if (isNaN(n)) {
        response.status(400);
        response.end("Petición incorrecta");
    } else {
        saUsuario.obtenerImagen(n, function (err, imagen) {
            if (imagen) {
                response.end(imagen);
            } else {
                response.status(404);
                response.sendFile("./images/default.png", {root: "public"});
            }
        });
    }
});

//Usuario
router.get("/logged_user", utils.auth, utils.getTiposAvisos, function (request, response) {
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

router.get("/logged_tec", utils.auth, function (request, response) {
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
router.post("/process_aviso", utils.auth, function (request, response) {

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

router.get("/historicosuser", utils.auth, utils.getTiposAvisos, function (request, response) {
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
router.get("/misavisos", utils.auth, utils.getTiposAvisos, function (request, response) {
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

router.get("/historicostec", utils.auth, utils.getTiposAvisos, function (request, response) {
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

//AJAX
router.get("/aviso/:idAviso", utils.auth, function (request, response) {

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

router.get("/tecnicos", utils.auth, function (request, response) {

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

router.post("/asignarTecnico", utils.auth, function (request, response) {

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

module.exports = router;
