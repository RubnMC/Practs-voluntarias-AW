const config = require("./config");
const mysql = require("mysql");
const daoUS = require("./public/javascripts/DAOUsuario");

const pool = mysql.createPool(config.mysqlConfig);

let dao = new daoUS(pool);
// let user = {
//     nombre,
//     nombrePublico,
//     correo,
//     rol,
//     numTecnico,
//     perfilUniversitario,
//     password
// };

function prueba(err, res) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res);
    }
}

dao.isUserCorrect("ministraGOV@vivaLaRepublica.ru", "pepe", prueba);
dao.createUser({
    nombre: "IreneMontero", correo: "ministraGOV@vivaLaRepublica.ru",
    rol: true, numTecnico: "1234-IRN", perfilUniversitario: "master", password: "pepe"
}, prueba);
