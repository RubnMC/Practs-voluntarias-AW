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
                connection.query(/*"SELECT A.idUser, A.email, C.texto, B.hecho, E.texto"+
                "FROM aw_tareas_usuarios A"+
                "LEFT JOIN aw_tareas_user_tareas B ON A.idUser = B.idUser"+
                "LEFT JOIN aw_tareas_tareas C ON B.idTarea = C.idTarea"+
                "LEFT JOIN aw_tareas_tareas_etiquetas D ON D.idTarea = C.idTarea"+
                "LEFT JOIN aw_tareas_etiquetas E ON E.idEtiqueta = D.idEtiqueta"+
                "WHERE B.hecho = true AND A.email = ?;",*/
                "SELECT A.idUser, A.email, C.texto, B.hecho, E.texto FROM aw_tareas_usuarios A"+
                " LEFT JOIN aw_tareas_user_tareas B ON A.idUser = B.idUser"+ 
                " LEFT JOIN aw_tareas_tareas C ON B.idTarea = C.idTarea"+ 
                " LEFT JOIN aw_tareas_tareas_etiquetas D ON D.idTarea = C.idTarea"+ 
                " LEFT JOIN aw_tareas_etiquetas E ON E.idEtiqueta = D.idEtiqueta"+ 
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
                connection.query("INSERT INTO aw_tareas_tareas(texto) VALUES (?)",
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
                                callback(null, true);
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

    deleteCompleted(email, callback) {

    }
}

module.exports = DAOTasks;