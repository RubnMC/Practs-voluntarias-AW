"use strict";

class DAOUsuario {
    constructor(pool) {
        this.pool = pool;
    }

    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM UCM_AW_CAU_USU_Usuarios WHERE correo = ?",
                    [email],
                    function (err, rows) {
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el password proporcionado
                            }
                            else {
                                let idUsuario = rows[0].idUsuario;
                                console.log(rows);
                                connection.query("SELECT * FROM UCM_AW_CAU_CON_Contrasenas WHERE password = ? AND idUsuario = ?",
                                    [password, idUsuario],
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
                                                callback(null, true);
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

    createUser(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                let userRol, signal = false;
                if (user.rol === true) {
                    userRol = "Técnico";
                    connection.query("SELECT * FROM UCM_AW_CAU_UT_UsuarioTecnico WHERE numTecnico = ?",
                        [user.numTecnico],
                        function (err, rows) {
                            if (err) {
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                            else {
                                if (rows.length === 0) {
                                    callback(null, "Este numero de técnico no existe"); //no está el usuario con el password proporcionado
                                }
                                connection.query("INSERT INTO UCM_AW_CAU_USU_Usuarios(nombre, nombrePublico, correo, rol, perfilUniversitario) VALUES (?, ?, ?, '" + userRol + "', ?)",
                                    [user.nombre, user.nombrePublico, user.correo, user.perfilUniversitario],
                                    function (err, rows) {
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos, insertar usuario"));
                                        }
                                        else {
                                            if (rows.length === 0) {
                                                callback(null, "No se ha podido añadir la tarea"); //no está el usuario con el password proporcionado
                                            }
                                            else {
                                                let idUsuario = rows[0].insertId;

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
                                                        }
                                                    }
                                                );

                                                connection.query("UPDATE UCM_AW_CAU_UT_UsuarioTecnico SET idUsuario = ? WHERE numTecnico = ?",
                                                [idUsuario, user.numTecnico],
                                                function (err, rows) {
                                                    if (err) {
                                                        callback(new Error("Error de acceso a la base de datos"));
                                                    }
                                                    else {
                                                        if (rows.length === 0) {
                                                            callback(null, "No se ha podido añadir al técnico"); //no está el usuario con el password proporcionado
                                                        }
                                                        else{
                                                            callback(null,"Técnico añadido correctamente");
                                                        }
                                                    }
                                                }
                                            );
                                            }
                                        }
                                    });
                            }
                        }
                    );
                } 
                else {
                    userRol = "Usuario";
                    connection.query("INSERT INTO UCM_AW_CAU_USU_Usuarios(nombre, nombrePublico, correo, rol, perfilUniversitario) VALUES (?, ?, ?, '" + userRol + "', ?)",
                        [user.nombre, user.nombrePublico, user.correo, user.perfilUniversitario],
                        function (err, rows) {
                            if (err) {
                                callback(new Error("Error de acceso a la base de datos, insertar usuario"));
                            }
                            else {
                                if (rows.length === 0) {
                                    callback(null, "No se ha podido añadir la tarea"); //no está el usuario con el password proporcionado
                                }
                                else {
                                    let idUsuario = rows[0].insertId;

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
                                            }
                                        }
                                    );
                                }
                            }
                        });
                }
            }
        }
        );
    }
}

module.exports = DAOUsuario;
