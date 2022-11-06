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
                connection.query("SELECT A.idUser, A.email, C.texto AS tarea, B.hecho, E.texto FROM aw_tareas_usuarios A" +
                    " LEFT JOIN aw_tareas_user_tareas B ON A.idUser = B.idUser" +
                    " LEFT JOIN aw_tareas_tareas C ON B.idTarea = C.idTarea" +
                    " LEFT JOIN aw_tareas_tareas_etiquetas D ON D.idTarea = C.idTarea" +
                    " LEFT JOIN aw_tareas_etiquetas E ON E.idEtiqueta = D.idEtiqueta" +
                    " WHERE B.hecho = true AND A.email = ?;",
                    [email],
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
                                callback(null, rows);
                            }
                        }
                    });
            }
        }
        );
    }

    insertTask(email, task, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT idUser FROM aw_tareas_usuarios WHERE email = ?;",
                    [email],
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

                                let idU = rows[0].idUser;
                                connection.query("INSERT INTO aw_tareas_tareas(texto) VALUES (?)",
                                    [task.text],
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
                                                let idT = rows[0].idTarea;
                                                connection.query("INSERT INTO aw_tareas_user_tareas(idUser,idTarea,hecho) VALUES (?,?,false);",
                                                    [idU, idT],
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
                                                                //INSERT INTO tag (taskId, tag) VALUES (?, ?), (?, ?), (?, ?)
                                                                let listaTags = "INSERT INTO aw_tareas_etiquetas (idEtiqueta, texto) VALUES";
                                                                task.tags.forEach(currentItem => {
                                                                    listaTags += " (" + currentItem.texto + ")";
                                                                });
                                                                connection.query(listaTags,
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
                        }
                    }
                );
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
                            callback(null,new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el password proporcionado
                            }
                            else {
                                callback(null, "Tarea completada!");
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
                connection.query("UPDATE aw_tareas_user_tareas SET hecho = 1 WHERE idTask = ?",
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
}

module.exports = DAOTasks;