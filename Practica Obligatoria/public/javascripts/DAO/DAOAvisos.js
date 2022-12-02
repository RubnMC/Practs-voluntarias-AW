"use strict"

const moment = require("moment");

function stampToDate(timestamp) {
    return moment(timestamp).format('DD/MM/YYYY')
}

class DAOAvisos {
    constructor(pool) {
        this.pool = pool;
    }

    createAviso(aviso, idUser, numTecnico, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de acceso a la base de datos"));
            } else {
                connection.query("INSERT INTO UCM_AW_CAU_AV_Avisos(texto,tipo,subtipo,observaciones,solucionado) VALUES (?,?,?,?,0);",
                    [aviso.texto, aviso.tipo, aviso.subtipo, aviso.observaciones],
                    function (err, rows) {
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, null); //no tiene avisos
                            }
                            else {
                                let idAviso = rows.insertId;
                                connection.query("INSERT INTO UCM_AW_CAU_AU_AvisosUsuarios(idUsuario,idAviso) VALUES (?,?);",
                                    [idUser, idAviso],
                                    function (err, rows) {
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else {
                                            if (rows.length === 0) {
                                                callback(null, null); //no tiene avisos
                                            } else {
                                                connection.query("INSERT INTO UCM_AW_CAU_AT_AvisosTecnicos(numTecnico,idAviso) VALUES (?,?);",
                                                    [numTecnico, idAviso],
                                                    function (err, rows) {
                                                        connection.release();
                                                        if (err) {
                                                            callback(new Error("Error de acceso a la base de datos"));
                                                        }
                                                        else {
                                                            if (rows.length === 0) {
                                                                callback(null, null); //no tiene avisos
                                                            } else {
                                                                callback(null, true);
                                                            }
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    }
                                );
                            }
                        }
                    }
                );
            }
        });
    }

    getAvisos(user, callback) {

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de acceso a la base de datos"));
            } else {
                if (user.rol === "Usuario") {
                    connection.query("SELECT * FROM ucm_aw_cau_au_avisosusuarios au JOIN ucm_aw_cau_av_avisos av ON au.idAviso = av.idAviso WHERE idUsuario = ?",
                        [user.idUsuario],
                        function (err, rows) {
                            connection.release(); // devolver al pool la conexión
                            if (err) {
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                            else {
                                if (rows.length === 0) {
                                    callback(null, null); //no tiene avisos
                                }
                                else {

                                    let arrayAvisos = [];
                                    let i = 0;

                                    rows.forEach(element => {
                                        arrayAvisos.push({
                                            idAviso: element.idAviso,
                                            tipo: element.tipo,
                                            texto: element.texto,
                                            subtipo: element.subtipo,
                                            fecha: stampToDate(element.fecha),
                                            observaciones: element.observaciones,
                                            solucionado: element.solucionado
                                        });
                                        i++;
                                    });

                                    callback(null, arrayAvisos);

                                }
                            }
                        });
                } else {

                }
            }
        });
    }


}

module.exports = DAOAvisos;
