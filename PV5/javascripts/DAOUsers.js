"use strict";

class DAOUsers {
    constructor(pool) {
        this.pool = pool;
    }

    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM aw_tareas_usuarios WHERE email = ? AND _password = ?",
                    [email, password],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el password proporcionado
                            }
                            else {
                                callback(null, rows[0].email);
                            }
                        }
                    });
            }
        }
        );
    }

    getUserImage(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT img FROM aw_tareas_usuarios WHERE email = ?",
                    [email],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, null); //no está el usuario con el email proporcionado
                            }
                            else {
                                callback(null, { imagen: rows[0].img });
                            }
                        }
                    });
            }
        }
        );
    }

    createUser(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM UCM_AW_CAU_USU_Usuarios WHERE correo = ?",
                    [user.correo],
                    function (err, rows) {
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                let userRol;
                                if (user.rol === true) {
                                    userRol = "Técnico";
                                    connection.query("SELECT * FROM UCM_AW_CAU_USU_Usuarios WHERE numTecnico = ?",
                                        [user.numTecnico],
                                        function (err, rows) {
                                            if (err) {
                                                callback(new Error("Error de acceso a la base de datos"));
                                            }
                                            else {
                                                if (rows.length > 0) {
                                                    callback(null, "Este numero de técnico ya existe"); //no está el usuario con el password proporcionado
                                                }
                                                else {

                                                    connection.query("INSERT INTO UCM_AW_CAU_USU_Usuarios(nombre, correo, rol, fecha, perfilUniversitario,numTecnico) VALUES (?, ?, '" + userRol + "', CURRENT_TIMESTAMP() , ?, ?);",
                                                        [user.nombre, user.correo, user.perfilUniversitario, user.numTecnico],
                                                        function (err, rows) {
                                                            if (err) {
                                                                callback(new Error("Error de acceso a la base de datos, insertar usuario"));
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
                                                                            connection.release();
                                                                            if (err) {
                                                                                callback(new Error("Error de acceso a la base de datos, insertar tarea"));
                                                                            }
                                                                            else {
                                                                                if (rows.length === 0) {
                                                                                    callback(null, "No se ha podido añadir la tarea"); //no está el usuario con el password proporcionado
                                                                                }
                                                                                else {
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
                                else {
                                    userRol = "Usuario";
                                    connection.query("INSERT INTO UCM_AW_CAU_USU_Usuarios(nombre, correo, rol, fecha, perfilUniversitario) VALUES (?, ?, '" + userRol + "', CURRENT_TIMESTAMP() , ?);",
                                        [user.nombre, user.correo, user.perfilUniversitario],
                                        function (err, rows) {
                                            if (err) {
                                                callback(new Error("Error de acceso a la base de datos, insertar usuario"));
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
                                                            connection.release();
                                                            if (err) {
                                                                callback(new Error("Error de acceso a la base de datos, insertar tarea"));
                                                            }
                                                            else {
                                                                if (rows.length === 0) {
                                                                    callback(null, false); //no está el usuario con el password proporcionado
                                                                }
                                                                else {
                                                                    callback(null, true);
                                                                }
                                                            }
                                                        }
                                                    );
                                                }
                                            }
                                        });
                                }
                            }
                            else {
                                callback(new Error("Esta dirección de correo ya está asignada a un usuario"));
                            }
                        }
                    });
            }
        }
        );
    }
}

module.exports = DAOUsers;
