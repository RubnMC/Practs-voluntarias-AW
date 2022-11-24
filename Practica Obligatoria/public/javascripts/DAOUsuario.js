"use strict";

class DAOUsuario {
    constructor(pool) {
        this.pool = pool;
    }

    creatUser(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                let userRol;
                if (user.rol === true) {
                    userRol = "Técnico";
                } else {
                    userRol = "Usuario";
                }
                connection.query("INSERT INTO UCM_AW_CAU_USU_Usuarios(nombre, nombrePublico, correo, rol, perfilUniversitario) VALUES (?, ?, ?, '" + userRol + "', ?)",
                    [user.nombre, user.nombrePublico, user.correo, user.perfilUniversitario],
                    function (err, rows) {
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos, insertar tarea"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, "No se ha podido añadir la tarea"); //no está el usuario con el password proporcionado
                            }
                            else {
                                let idUsuario = rows.insertId;

                                connection.query("INSERT INTO UCM_AW_CAU_CON_Contrasenas(idUsuario, password) VALUES (?, ?)",
                                    [idUsuario, user.password],
                                    function (err, rows) {
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos, insertar tarea"));
                                        }
                                        else {
                                            if (rows.length === 0) {
                                                callback(null, "No se ha podido añadir la tarea"); //no está el usuario con el password proporcionado
                                            }
                                            else {
                                                //COMPLETADO
                                            }
                                        }
                                    });
                            }
                        }
                    });

            }
        }
        );
    }
}