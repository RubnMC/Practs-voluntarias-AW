"use strict";

class DAOTasks {
    constructor(pool) {
        this.pool = pool;
    }

    getAllTasks(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT A.idUser, A.email, C.texto AS tarea, C.idTarea, B.hecho FROM aw_tareas_usuarios A" +
                    " LEFT JOIN aw_tareas_user_tareas B ON A.idUser = B.idUser" +
                    " LEFT JOIN aw_tareas_tareas C ON B.idTarea = C.idTarea" +
                    " WHERE A.email = ?;",
                    [email],
                    function (err, rows) {
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            let tareas = rows;
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el password proporcionado
                            }
                            else {
                                connection.query("SELECT B.idTarea, E.idEtiqueta, E.texto FROM aw_tareas_usuarios A" +
                                    " LEFT JOIN aw_tareas_user_tareas B ON A.idUser = B.idUser" +
                                    " LEFT JOIN aw_tareas_tareas C ON B.idTarea = C.idTarea" +
                                    " LEFT JOIN aw_tareas_tareas_etiquetas D ON D.idTarea = C.idTarea" +
                                    " LEFT JOIN aw_tareas_etiquetas E ON E.idEtiqueta = D.idEtiqueta" +
                                    " WHERE A.email = ?;",
                                    [email],
                                    function (err, rows) {
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else {
                                            connection.release();
                                            if (rows.length === 0) {
                                                callback(null, false); //no está el usuario con el password proporcionado
                                            }
                                            else {
                                                callback(null, {tareas:tareas, etiquetas:rows});
                                            }
                                        }
                                    });
                            }
                        }
                    }
                );
            }
        }
        );
    }

    insertTask(email, task, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos pool"));
            }
            else {
                connection.query("SELECT idUser FROM aw_tareas_usuarios WHERE email = ?;",
                    [email],
                    function (err, rows) {
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos, buscar usuario"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, "No existe el usuario"); //no está el usuario con el password proporcionado
                            }
                            else {
                                let idUsuario = rows[0].idUser;

                                connection.query("INSERT INTO aw_tareas_tareas(texto) VALUES (?)",
                                    [task.texto],
                                    function (err, rows) {
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos, insertar tarea"));
                                        }
                                        else {
                                            if (rows.length === 0) {
                                                callback(null, "No se ha podido añadir la tarea"); //no está el usuario con el password proporcionado
                                            }
                                            else {
                                                let idTarea = rows.insertId;
                                                let sentenciaTags = "INSERT INTO aw_tareas_etiquetas(texto) VALUES";


                                                task.tags.forEach(function (element, idx, array) {
                                                    if (idx === array.length - 1) {
                                                        sentenciaTags += " ('" + element + "');";
                                                    } else {
                                                        sentenciaTags += " ('" + element + "'),";
                                                    }
                                                });


                                                connection.query(sentenciaTags,

                                                    function (err, rows) {
                                                        if (err) {
                                                            callback(new Error("Error de acceso a la base de datos, insertar etiquetas"));
                                                        }
                                                        else {
                                                            if (rows.length === 0) {
                                                                callback(null, "No existe el usuario"); //no está el usuario con el password proporcionado
                                                            }
                                                            else {
                                                                let sentenciaTareaTag = "INSERT INTO aw_tareas_tareas_etiquetas (idEtiqueta, idTarea) VALUES";


                                                                for (let i = 0; i < rows.affectedRows; i++) {
                                                                    if (i === rows.affectedRows - 1) {
                                                                        sentenciaTareaTag += " (" + (rows.insertId + i) + ", " + idTarea + ")";
                                                                    } else {
                                                                        sentenciaTareaTag += " (" + (rows.insertId + i) + ", " + idTarea + "),";
                                                                    }
                                                                }


                                                                connection.query(sentenciaTareaTag,
                                                                    function (err, rows) {
                                                                        connection.release(); // devolver al pool la conexión
                                                                        if (err) {
                                                                            callback(new Error("Error de acceso a la base de datos, insertar realación tarea etiqueta"));
                                                                        }
                                                                        else {
                                                                            if (rows.length === 0) {
                                                                                callback(null, "Problemas"); //no está el usuario con el password proporcionado
                                                                            }
                                                                            else {
                                                                                callback(null, "Tarea insertada con éxito!!");
                                                                            }
                                                                        }
                                                                    });
                                                            }
                                                        }
                                                    });

                                                connection.query("INSERT INTO aw_tareas_user_tareas(idUser, idTarea, hecho) VALUES(?, ?, false)",
                                                    [idUsuario, idTarea],
                                                    function (err, rows) {
                                                        if (err) {
                                                            callback(new Error("Error de acceso a la base de datos, relación tarea usuario"));
                                                        }
                                                        else {
                                                            if (rows.length === 0) {
                                                                callback(null, "Problemas"); //no está el usuario con el password proporcionado
                                                            }
                                                            else {
                                                                /*CONTINUA*/
                                                            }
                                                        }
                                                    });
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

    markTaskDone(idTask, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("UPDATE aw_tareas_user_tareas SET hecho = 1 WHERE idTarea = ?;",
                    [idTask],
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
        );
    }

    deleteCompleted(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT idUser FROM aw_tareas_usuarios WHERE email = ?;",
                    [email],
                    function (err, rows) {
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos, buscar usuario"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, "No existe el usuario"); //no está el usuario con el password proporcionado
                            }
                            else {
                                let idUsuario = rows[0].idUser;

                                connection.query("SELECT idTarea FROM aw_tareas_user_tareas WHERE idUser = ? AND hecho = true;",
                                    [idUsuario],
                                    function (err, rows) {
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else {
                                            if (rows.length === 0) {
                                                connection.release();
                                                callback(null, "No tiene ninguna tarea completada"); //no está el usuario con el password proporcionado
                                            }
                                            else {

                                                rows.forEach((element, idx, array) => {
                                                    connection.query("SELECT * FROM aw_tareas_user_tareas WHERE idTarea = ?;",
                                                        [element.idTarea],
                                                        function (err, rows) {
                                                            if (err) {
                                                                callback(new Error("Error de acceso a la base de datos"));
                                                            }
                                                            else {
                                                                if (rows.length === 1) {
                                                                    connection.query("DELETE FROM aw_tareas_user_tareas WHERE idTarea = ?;",
                                                                        [element.idTarea],
                                                                        function (err, rows) {
                                                                            if (err) {
                                                                                callback(new Error("Error de acceso a la base de datos, borrar relación tarea-usuario"));
                                                                            }
                                                                            else {
                                                                                connection.query("DELETE FROM aw_tareas_tareas WHERE idTarea = ?;",
                                                                                    [element.idTarea],
                                                                                    function (err, rows) {
                                                                                        if (err) {
                                                                                            callback(new Error("Error de acceso a la base de datos, borrar tarea"));
                                                                                        }
                                                                                        else {
                                                                                            if (rows.length === 0) {
                                                                                                callback(null, false); //no está el usuario con el password proporcionado
                                                                                            }
                                                                                            else {
                                                                                                if (idx === array.length - 1) {
                                                                                                    connection.release();
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    });

                                                                            }
                                                                        });
                                                                }
                                                                else {
                                                                    connection.query("DELETE FROM aw_tareas_user_tareas WHERE idTarea = ? AND idUser = ?;",
                                                                        [element.idTarea, idUsuario],
                                                                        function (err, rows) {
                                                                            if (err) {
                                                                                callback(new Error("Error de acceso a la base de datos, borrar relación tarea-usuario"));
                                                                            }
                                                                            else {
                                                                                if (idx === array.length - 1) {
                                                                                    connection.release();
                                                                                }
                                                                            }
                                                                        });
                                                                }
                                                            }
                                                        });
                                                });

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

module.exports = DAOTasks;