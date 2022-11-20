"use strict";

class DAOUsers {
    constructor(pool) {
        this.pool = pool;
    }

    isUserCorrect(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                if (user.rol === true) {
                    connection.query("INSERT INTO UCM_AW_CAU_USU_Usuarios(nombre, correo, rol, perfilUniversitario) VALUES (?, ?, 'Técnico', ?)",
                        [user.nombre, user.correo, user.perfilUniversitario],
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

                } else {
                    connection.query("INSERT INTO UCM_AW_CAU_USU_Usuarios(nombre, correo, rol, perfilUniversitario) VALUES (?, ?, 'Usuario', ?)",
                        [user.nombre, user.correo, user.perfilUniversitario],
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
        }
        );
    }
}