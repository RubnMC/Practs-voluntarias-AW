DROP TABLE IF EXISTS UCM_AW_CAU_AT_AvisosTecnicos;
DROP TABLE IF EXISTS UCM_AW_CAU_AU_AvisosUsuarios;
DROP TABLE IF EXISTS UCM_AW_CAU_AV_Avisos;
DROP TABLE IF EXISTS UCM_AW_CAU_UT_UsuarioTecnico;
DROP TABLE IF EXISTS UCM_AW_CAU_CON_Contrasenas;
DROP TABLE IF EXISTS UCM_AW_CAU_USU_Usuarios;
DROP TABLE IF EXISTS UCM_AW_CAU_SU_Sugerencias;

CREATE TABLE UCM_AW_CAU_USU_Usuarios(
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    correo VARCHAR(30) NOT NULL,
    rol VARCHAR(10) NOT NULL,
    fecha TIMESTAMP NOT NULL,
    imagen BLOB,
    perfilUniversitario VARCHAR(20) NOT NULL,
    numTecnico VARCHAR(8) UNIQUE
);

CREATE TABLE UCM_AW_CAU_CON_Contrasenas(
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    password VARCHAR(32) NOT NULL,
   	FOREIGN KEY(idUsuario) REFERENCES UCM_AW_CAU_USU_Usuarios(idUsuario)
);

CREATE TABLE UCM_AW_CAU_AV_Avisos(
    idAviso INT PRIMARY KEY AUTO_INCREMENT,
    texto VARCHAR(300) NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    subtipo VARCHAR(50),
    fecha TIMESTAMP NOT NULL,
    observaciones VARCHAR(300),
    solucionado BOOLEAN NOT NULL
);

CREATE TABLE UCM_AW_CAU_AU_AvisosUsuarios(
    idUsuario INT,
    idAviso INT,
   	FOREIGN KEY(idUsuario) REFERENCES UCM_AW_CAU_USU_Usuarios(idUsuario),
    FOREIGN KEY(idAviso) REFERENCES UCM_AW_CAU_AV_Avisos(idAviso),
    CONSTRAINT PK_UCM_AW_CAU_AU_AvisosUsuarios PRIMARY KEY (idUsuario,idAviso)
);

CREATE TABLE UCM_AW_CAU_AT_AvisosTecnicos(
    numTecnico VARCHAR(8),
    idAviso INT,
   	FOREIGN KEY(numTecnico) REFERENCES CREATE TABLE UCM_AW_CAU_USU_Usuarios(numTecnico),
    FOREIGN KEY(idAviso) REFERENCES UCM_AW_CAU_AV_Avisos(idAviso),
    CONSTRAINT PK_UCM_AW_CAU_AT_AvisosTecnicos PRIMARY KEY (numTecnico,idAviso)
);