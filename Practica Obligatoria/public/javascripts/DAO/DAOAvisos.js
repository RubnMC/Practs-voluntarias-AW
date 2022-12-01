"use strict"

class DAOAvisos {
    constructor(pool) {
        this.pool = pool;
    }

    createAviso(aviso) {

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
                            let aviso = {
                                idAviso: rows[0].idAviso,
                                texto: rows[0].texto,
                                subtipo: rows[0].subtipo,
                                fecha: rows[0].fecha,
                                observaciones: rows[0].observaciones,
                                solucionado: rows[0].solucionado
                            };
                            
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
