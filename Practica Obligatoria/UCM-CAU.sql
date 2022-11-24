/*DROP TABLE UCM_AW_CAU_AU_AvisosUsuarios;
DROP TABLE UCM_AW_CAU_AV_Avisos;
DROP TABLE UCM_AW_CAU_UT_UsuarioTecnico;
DROP TABLE UCM_AW_CAU_CON_Contrasenas;
DROP TABLE UCM_AW_CAU_USU_Usuarios;*/

CREATE TABLE UCM_AW_CAU_USU_Usuarios(
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    nombrePublico VARCHAR(30) NOT NULL,
    correo VARCHAR(30) NOT NULL,
    rol VARCHAR(10) NOT NULL,
    fecha DATE NOT NULL,
    perfilUniversitario VARCHAR(20) NOT NULL
);

CREATE TABLE UCM_AW_CAU_CON_Contrasenas(
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    password VARCHAR(32) NOT NULL,
   	FOREIGN KEY(idUsuario) REFERENCES UCM_AW_CAU_USU_Usuarios(idUsuario)
);

CREATE TABLE UCM_AW_CAU_UT_UsuarioTecnico(
    numTecnico VARCHAR(8) PRIMARY KEY,
    idUsuario INT,
    FOREIGN KEY(idUsuario) REFERENCES UCM_AW_CAU_USU_Usuarios(idUsuario)
);


CREATE TABLE UCM_AW_CAU_AV_Avisos(
    idAviso INT PRIMARY KEY AUTO_INCREMENT,
    texto VARCHAR(30) NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    fecha DATE NOT NULL
);

CREATE TABLE UCM_AW_CAU_AU_AvisosUsuarios(
    idUsuario INT,
    idAviso INT,
   	FOREIGN KEY(idUsuario) REFERENCES UCM_AW_CAU_USU_Usuarios(idUsuario),
    FOREIGN KEY(idAviso) REFERENCES UCM_AW_CAU_AV_Avisos(idAviso),
    CONSTRAINT PK_UCM_AW_CAU_AU_AvisosUsuarios PRIMARY KEY (idUsuario,idAviso)
);