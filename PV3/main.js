"use strict";
const mysql = require("./node_modules/mysql");
const config = require("./config");
const DAOUsers = require("./DAOUsers");
const DAOTasks = require("./DAOTasks");
// Crear el pool de conexiones
const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});
let daoUser = new DAOUsers(pool);
let daoTask = new DAOTasks(pool);


// Definición de las funciones callback
// Uso de los métodos de las clases DAOUsers y DAOTasks

function prueba (a,b){
    if(a){
        console.log(a);
    } else{
        console.log(b);
    }
}

daoTask.deleteCompleted("steve.curros@ucm.es", prueba);
/*daoUser.isUserCorrect("aitor.tilla@ucm.es","aitor",prueba);
daoUser.getUserImage("aitor.tilla@ucm.es",prueba);
daoTask.getAllTasks("bill.puertas@ucm.es",prueba);
daoTask.markTaskDone(1,prueba);
daoTask.insertTask("aitor.tilla@ucm.es", {texto:"Prueba de tarea 1", tags:["Tag1", "Tag2"]}, prueba);*/

