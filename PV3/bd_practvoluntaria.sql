DROP TABLE aw_tareas_tareas_etiquetas;
DROP TABLE aw_tareas_user_tareas;
DROP TABLE aw_tareas_etiquetas;
DROP TABLE aw_tareas_tareas;
DROP TABLE aw_tareas_usuarios;

CREATE TABLE aw_tareas_usuarios(
    idUser INT  PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(20) NOT NULL,
    _password VARCHAR(20) NOT NULL,
    img VARCHAR(20)
);

CREATE TABLE aw_tareas_tareas(
    idTarea INT PRIMARY KEY AUTO_INCREMENT,
    texto VARCHAR(500) NOT NULL
);

CREATE TABLE aw_tareas_etiquetas(
    idEtiqueta INT  PRIMARY KEY AUTO_INCREMENT,
    texto VARCHAR(20) NOT NULL
);

CREATE TABLE aw_tareas_user_tareas(
	idUser INT,
    idTarea INT,
    hecho BOOLEAN NOT NULL,
    FOREIGN KEY(idUser) REFERENCES aw_tareas_usuarios(idUser),
    FOREIGN KEY(idTarea) REFERENCES aw_tareas_tareas(idTarea),
    CONSTRAINT PK_tareas_user_tarea PRIMARY KEY (idUser,idTarea)
);

CREATE TABLE aw_tareas_tareas_etiquetas(
	idEtiqueta INT,
    idTarea INT,
    FOREIGN KEY(idEtiqueta) REFERENCES aw_tareas_etiquetas(idEtiqueta),
    FOREIGN KEY(idTarea) REFERENCES aw_tareas_tareas(idTarea)  ON DELETE CASCADE,
    CONSTRAINT PK_tareas_tareas_etiqueta PRIMARY KEY (idEtiqueta, idTarea)
);

INSERT INTO aw_tareas_usuarios(email,_password,img)
VALUES('aitor.tilla@ucm.es', 'aitor', 'aitor.jpg'), ('felipe.lotas@ucm.es', 'felipe',
'felipe.jpg'),('steve.curros@ucm.es', 'steve', 'steve.jpg'), ('bill.puertas@ucm.es', 'bill', 'bill.jpg');

INSERT INTO aw_tareas_tareas(texto) VALUES('Preparar prácticas AW'), ('Mirar fechas de congreso'), 
('Ir al Supermercado'), ('Jugar al Fútbol'), ('Hablar con el profesor');

INSERT INTO aw_tareas_user_tareas (idUser, idTarea, hecho)
VALUES (1, 1,0), (1,2,1), (1,3,0), (1,4,0), (1,5,0), (2, 3,0), (2,4,0), (2,5,0), (3,1,0), (3,2,0), (3,3,1), (3,4,0), (4,1,1), (4,2,0),
(4,3,1), (4,4,0) ;

INSERT INTO aw_tareas_etiquetas(texto)
VALUES ('Universidad'), ('AW'), ('TP'), ('Práctica'), ('Personal'), ('Académico'), ('Deporte'), ('Básico');

INSERT INTO aw_tareas_tareas_etiquetas(idTarea, idEtiqueta)
VALUES (1,1), (1,2), (1,3), (2,6),(3,5), (3,6), (4,5), (4,7), (5,1), (5,3);

