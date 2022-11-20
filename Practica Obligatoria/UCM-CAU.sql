CREATE TABLE UCM_AW_CAU_USU_Usuarios(
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    correo VARCHAR(30) NOT NULL,
    rol VARCHAR(10) NOT NULL,
    perfilUniversitario VARCHAR(20) NOT NULL
);

CREATE TABLE UCM_AW_CAU_CON_Contrasenas(
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    password VARCHAR(32) NOT NULL,
   	FOREIGN KEY(idUsuario) REFERENCES UCM_AW_CAU_USU_Usuarios(idUsuario)
);