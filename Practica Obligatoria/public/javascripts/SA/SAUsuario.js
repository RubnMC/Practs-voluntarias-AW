"use strict";
const DAOUsuario = require("../DAO/DAOUsuario");

class SAUsuario {
    constructor(pool) {
        this.daoUser = new DAOUsuario(pool);
        this.today = new Date();
    }

    crearUsuario(user, callback) {
        if (user.password !== user.password_2) {
            callback(new Error("Las contraseñas no coinciden"));
        }
        else if (user.numTecnico && !(/\d{4}\-[A-Z]{3}/.test(user.numTecnico))) {
            callback(new Error("Formato de num.empleado incorrecto (0000-ABC)"));
        }
        // if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(user.password)) {
        //     callback(new Error("La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, una minúscula, una mayuscula y un caracter especial"));
        // }
        else {
            this.daoUser.createUser(user, function (err, res) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, res);
                }
            });
        }
    }

    usuarioCorrecto(userData, callback) {
        this.daoUser.isUserCorrect(userData.email, userData.password, function (err, res) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, res);
            }
        })
    }

    getAllTecnicos(callback) {
        this.daoUser.getAllTecnicos(function (err, res) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, res);
            }
        })
    }

    obtenerImagen(id, callback){
        this.daoUser.obtenerImagen(id, function (err, res) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, res);
            }
        })
    }
}

module.exports = SAUsuario;
