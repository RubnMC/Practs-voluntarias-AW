const config = require("./config");
const mysql = require("mysql");
const daoUS = require("./public/javascripts/DAOUsuario");

const pool = mysql.createPool(config.mysqlConfig);

let dao = new daoUS(pool);
let user = {
    nombre,
    nombrePublico,
    correo,
    rol,
    numTecnico,
    perfilUniversitario,
    password
};

function prueba(err, res) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res);
    }
}

//dao.isUserCorrect("pepe","pepe", prueba);
dao.createUser({ nombre: "pepe", nombrePublico: "pepe", correo: "pepe@correo",
 rol: false, numTecnico: "aaaaaaaa", perfilUniversitario: "buenardo", password: "1234" },prueba);
