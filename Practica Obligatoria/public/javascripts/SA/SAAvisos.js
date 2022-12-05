"use strict";

const DAOAvisos = require('../DAO/DAOAvisos');

class SAAvisos {
    constructor(pool) {
        this.daoAvisos = new DAOAvisos(pool);
        this.today = new Date();
    }

    getAvisos(user, callback) {
        this.daoAvisos.getAvisos(user, function (err, res) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, res);
            }
        })
    }

    crearAviso(aviso, idUser, callback) {

        let avisoParseado = {
            tipo: aviso.type,
            texto: aviso.texto_aviso,
            subtipo: aviso.profile_type.replaceAll("_"," ").replaceAll(":",": ")
        }

        this.daoAvisos.createAviso(avisoParseado, idUser, function (err, res) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, res);
            }
        });
    }

    asignarTecnico(aviso, numTecnico, callback) {
        this.daoAvisos.asignarTecnico(aviso, numTecnico, function (err, res) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, res);
            }
        });
    }


}

module.exports = SAAvisos;
