"use strict"

class DAOAvisos {
    constructor(pool) {
        this.pool = pool;
    }

    createAviso(aviso, idUser, numTecnico) {
        connection.query("INSERT INTO UCM_AW_CAU_AV_Avisos(texto,tipo,subtipo,fecha,observaciones,solucionado) VALUES (?,?,?,?,?);",
            [aviso.texto, aviso.subtipo, aviso.fecha, aviso.observaciones, false],
            function (err, rows) {
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    if (rows.length === 0) {
                        callback(null, null); //no tiene avisos
                    }
                    else {
                        let idAviso = rows[0].idAviso;
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

    getAvisos(user, callback) {
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

                            let arrayAvisos;
                            let i = 0;

                            rows.forEach(element => {
                                arrayAvisos[i] = {
                                    idAviso: rows[0].idAviso,
                                    texto: rows[0].texto,
                                    subtipo: rows[0].subtipo,
                                    fecha: rows[0].fecha,
                                    observaciones: rows[0].observaciones,
                                    solucionado: rows[0].solucionado
                                };
                                i++;
                            });

                            callback(null, arrayAvisos);

                        }
                    }
                });
        } else {

        }
    }
}

module.exports = {
    DAOAvisos
};
