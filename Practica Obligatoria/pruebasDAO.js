const config = require("./config");
const mysql = require("mysql");
const DAOAvisos = require('./public/javascripts/DAO/DAOAvisos');

const pool = mysql.createPool(config.mysqlConfig);
let dao = new DAOAvisos(pool);

var today = new Date();
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

let aviso = {
    texto: "hola soy una aviso",
    tipo: "jodido",
    subtipo: "muy jodido",
    fecha: today,
    observaciones: "estoy ciego",
};

//dao.createAviso(aviso,1,2,prueba);
// dao.isUserCorrect("ministraGOV@vivaLaRepublica.ru", "pepe", prueba);
// dao.createUser({
//     nombre: "IreneMontero", correo: "ministraGOV@vivaLaRepublica.ru",
//     rol: true, numTecnico: "1234-IRN", perfilUniversitario: "master", password: "pepe"
// }, prueba);

dao.getAvisos({idUsuario: 1, rol:"Usuario"}, prueba);

console.log("FIN");