"use strict"

const moment = require("moment");

function stampToDate(timestamp) {
    return moment(timestamp).format('DD/MM/YYYY')
}

class DAOAvisos {
    constructor(pool) {
        this.pool = pool;
    }

    asignarTecnico(idAviso, numTecnico, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de acceso a la base de datos"));
            } else {
                connection.query("INSERT INTO UCM_AW_CAU_AT_AvisosTecnicos(numTecnico,idAviso) VALUES (?,?)",
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
        });
 
    }

    createAviso(aviso, idUser, callback) {
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
                                                if (rows.length === 0) {
                                                    callback(null, null); //no tiene avisos
                                                } else {
                                                    callback(null, true);
                                                }
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

    getAvisosUsuario(user, historicos, callback) {

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de acceso a la base de datos"));
            } else {
                if (user.rol === "Usuario") {
                    connection.query("SELECT av.idAviso, av.texto, av.observaciones, av.tipo, av.subtipo, av.solucionado, "+
                    " (SELECT nombre FROM ucm_aw_cau_usu_usuarios aw WHERE idUsuario = ?) as nombreUsuario, at.numTecnico, usu.nombre as nombreTecnico"+
                    " FROM ucm_aw_cau_au_avisosusuarios au JOIN ucm_aw_cau_av_avisos av ON au.idAviso = av.idAviso " + 
                    " LEFT JOIN ucm_aw_cau_at_avisostecnicos at ON av.idAviso = at.idAviso LEFT JOIN ucm_aw_cau_usu_usuarios usu ON at.numTecnico = usu.numTecnico " + 
                    " WHERE au.idUsuario = ? AND av.solucionado = ?",
                        [user.idUsuario, user.idUsuario, historicos],
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
                                            solucionado: element.solucionado,
                                            nombreTecnico: element.nombreTecnico,
                                            nombreUsuario: element.nombreUsuario
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

    getAvisosEntrantes(callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de acceso a la base de datos"));
            } else {
                    connection.query("SELECT av.idAviso, av.texto, av.tipo, av.subtipo, av.fecha, av.observaciones, av.solucionado, at.numTecnico, usu.nombre" +
                                    " FROM ucm_aw_cau_av_avisos av LEFT JOIN ucm_aw_cau_at_avisostecnicos at ON av.idAviso = at.idAviso" + 
                                    " LEFT JOIN ucm_aw_cau_usu_usuarios usu ON usu.numtecnico = at.numTecnico WHERE av.solucionado = 0",
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
                                            solucionado: element.solucionado,
                                            numTecnico: element.numTecnico,
                                            nombreTecnico: element.nombre
                                        });
                                        i++;
                                    });

                                    callback(null, arrayAvisos);

                                }
                            }
                        });
           }
        });
    }

    getAvisosTecnico(user, historicos, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de acceso a la base de datos"));
            } else {
                    connection.query("SELECT av.idAviso, av.texto, av.tipo, av.subtipo, av.fecha, av.observaciones, av.solucionado, at.numTecnico, usu.nombre" +
                                    " FROM ucm_aw_cau_av_avisos av LEFT JOIN ucm_aw_cau_at_avisostecnicos at ON av.idAviso = at.idAviso" + 
                                    " LEFT JOIN ucm_aw_cau_usu_usuarios usu ON usu.numtecnico = at.numTecnico WHERE av.solucionado = ? AND at.numTecnico = ?",
                            [historicos, user.numTecnico],
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
                                            solucionado: element.solucionado,
                                            numTecnico: element.numTecnico,
                                            nombreTecnico: element.nombre
                                        });
                                        i++;
                                    });

                                    callback(null, arrayAvisos);

                                }
                            }
                        });
           }
        });
    }

    getInfoAviso(id, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de acceso a la base de datos"));
            } else {
                    connection.query("SELECT av.idAviso, av.texto, av.tipo, av.subtipo, av.fecha, av.observaciones, av.solucionado, usu.idUsuario, usu.nombre as nombreUsuario," +
                        " usu.perfilUniversitario, usu2.idUsuario as idTecnico, usu2.nombre as nombreTecnico" +
                        " FROM ucm_aw_cau_av_avisos av LEFT JOIN ucm_aw_cau_au_avisosusuarios au ON av.idAviso = au.idAviso " +
                        " LEFT JOIN ucm_aw_cau_usu_usuarios usu ON au.idUsuario = usu.idUsuario LEFT JOIN ucm_aw_cau_at_avisostecnicos at" +
                        " ON av.idAviso = at.idAviso LEFT JOIN ucm_aw_cau_usu_usuarios usu2 ON usu2.numTecnico = at.numTecnico WHERE av.idAviso = ?",
                            [id],
                        function (err, rows) {
                            connection.release(); // devolver al pool la conexión
                            console.log(rows);
                            if (err) {
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                            else {
                                if (rows.length === 0) {
                                    callback(null, null); //no tiene avisos
                                }
                                else {

                                    let aviso = {
                                        idAviso: rows[0].idAviso,
                                        texto: rows[0].texto,
                                        tipo: rows[0].tipo,
                                        subtipo: rows[0].subtipo.split(" "),
                                        fecha: stampToDate(rows[0].fecha),
                                        observaciones: rows[0].observaciones,
                                        solucionado: rows[0].solucionado,
                                        idUsuario: rows[0].idUsuario,
                                        nombreUsuario: rows[0].nombreUsuario,
                                        idTecnico: rows[0].idTecnico,
                                        nombreTecnico: rows[0].nombreTecnico, 
                                        perfilUniversitario: rows[0].perfilUniversitario
                                    };

                                    callback(null, aviso);

                                }
                            }
                        });
           }
        });
    }


}

module.exports = DAOAvisos;
