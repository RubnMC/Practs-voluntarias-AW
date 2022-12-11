"use strict";

const moment = require("moment");
const utils = require("../../../utils");

function stampToDate(timestamp) {
    return moment(timestamp).format('DD/MM/YYYY HH:mm:ss')
}

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
                                let usuario = {
                                    idUsuario: rows[0].idUsuario,
                                    correo: rows[0].correo,
                                    rol: rows[0].rol,
                                    perfilVisible: utils.parseUserType(rows[0].perfilUniversitario),
                                    numTecnico: rows[0].numTecnico,
                                    nombre: rows[0].nombre,
                                    perfilUniversitario: rows[0].perfilUniversitario,
                                    fecha: stampToDate(rows[0].fecha),
                                    imagen: rows[0].imagen
                                };

                                connection.query("SELECT * FROM UCM_AW_CAU_CON_Contrasenas WHERE password = ? AND idUsuario = ?",
                                    [password, usuario.idUsuario],
                                    function (err, rows) {
                                        connection.release(); // devolver al pool la conexión
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else {
                                            if (rows.length === 0) {
                                                callback(null, null); //no está el usuario con el password proporcionado
                                            }
                                            else {
                                                callback(null, usuario);
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

                                                    connection.query("INSERT INTO UCM_AW_CAU_USU_Usuarios(nombre, correo, rol, fecha, imagen, perfilUniversitario,numTecnico) VALUES (?, ?, '" + userRol + "', CURRENT_TIMESTAMP(), ?, ?, ?);",
                                                        [user.nombre, user.correo, user.imagen, user.perfilUniversitario, user.numTecnico],
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
                                    connection.query("INSERT INTO UCM_AW_CAU_USU_Usuarios(nombre, correo, rol, fecha, imagen, perfilUniversitario) VALUES (?, ?, '" + userRol + "', CURRENT_TIMESTAMP(), ?, ?);",
                                        [user.nombre, user.correo, user.imagen, user.perfilUniversitario],
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

    getAllTecnicos(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM UCM_AW_CAU_USU_Usuarios WHERE numTecnico IS NOT NULL",
                    function (err, rows) {
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el password proporcionado
                            }
                            else {
                                let tecnicos = [];
                                rows.forEach(t => {
                                    tecnicos.push({
                                        idUsuario: t.idUsuario,
                                        numTecnico: t.numTecnico,
                                        nombre: t.nombre,
                                    });
                                });

                                callback(null, tecnicos);
                            }
                        }
                    });
            }
        }
        );
    }

    // obtenerImagen(id, callback) {
    //     this.pool.getConnection(function (err, connection) {
    //         if (err) {
    //             callback(new Error("Error de conexión a la base de datos"));
    //         }
    //         else {
    //             let sql = "SELECT imagen FROM UCM_AW_CAU_USU_Usuarios WHERE idUsuario = ?";
    //             connection.query(sql, [id], function (err, rows) {
    //                 connection.release();
    //                     if (err) {
    //                         callback(new Error("Error de acceso a la base de datos"));
    //                     }
    //                     else {
    //                         if (rows.length === 0) {
    //                             callback(null, false); //no está el usuario con el password proporcionado
    //                         }
    //                         else {
    //                             console.log(rows);
                               
    //                             callback(null, rows[0].foto);
    //                         }
    //                     }
    //                 });
    //         }
    //     }
    //     );    
    // }
}

module.exports = DAOUsuario;
