"use strict";

const DAOAvisos = require('../DAO/DAOAvisos');

class SAAvisos {
    constructor(pool) {
        this.daoAvisos = new DAOAvisos(pool);
        this.today = new Date();
    }

    getAvisos(user, historico, callback) {

        if (historico) {
            this.daoAvisos.getAvisosUsuario(user, 1, function (err, res) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, res);
                }
            })
        } else {
            this.daoAvisos.getAvisosUsuario(user, 0, function (err, res) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, res);
                }
            })
        }

    }

    getAvisosTecnico(user, opcion, callback) {

        switch (opcion) {
            case 1:
                this.daoAvisos.getAvisosEntrantes(function (err, res) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, res);
                    }
                })
            break;

            case 2:
                this.daoAvisos.getAvisosTecnico(user, 0, function (err, res) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, res);
                    }
                })
            break;

            case 3:
                this.daoAvisos.getAvisosTecnico(user, 1, function (err, res) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, res);
                    }
                })
            break;
        }

    }

    crearAviso(aviso, idUser, callback) {

        let avisoParseado = {
            tipo: aviso.type,
            texto: aviso.texto_aviso,
            subtipo: aviso.profile_type.replaceAll("_", " ").replace(":", ": ")
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

    asignarTecnico(idAviso, numTecnico, callback) {
        this.daoAvisos.asignarTecnico(idAviso, numTecnico, function (err, res) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, res);
            }
        });
    }

    getInfoAviso(id, callback) {

        this.daoAvisos.getInfoAviso(id, function (err, res) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, res);
            }
        });
    }

    solucionarAviso(id, solucion, callback) {

        this.daoAvisos.solucionarAviso(id, solucion, function (err, res) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, res);
            }
        });
    }

    contadorAvisos(id, rol, callback){
        this.daoAvisos.contadorAvisos(id, rol, function (err, res) {
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
