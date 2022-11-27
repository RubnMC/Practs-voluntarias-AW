const config = require("./config");
const mysql = require("mysql");

const pool = mysql.createPool(config.mysqlConfig);

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

// dao.isUserCorrect("ministraGOV@vivaLaRepublica.ru", "pepe", prueba);
// dao.createUser({
//     nombre: "IreneMontero", correo: "ministraGOV@vivaLaRepublica.ru",
//     rol: true, numTecnico: "1234-IRN", perfilUniversitario: "master", password: "pepe"
// }, prueba);

console.log(today.toLocaleString());