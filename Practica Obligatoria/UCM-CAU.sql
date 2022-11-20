/*DROP TABLE UCM_AW_CAU_CON_Contrasenas;
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
    idUsuario INT PRIMARY KEY,
    numTecnico INT PRIMARY KEY 
);

CREATE TABLE UCM_AW_CAU_AV_Avisos(
    idAviso INT PRIMARY KEY AUTO_INCREMENT,
    texto VARCHAR(30) NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    fecha DATE NOT NULL
);

CREATE TABLE UCM_AW_CAU_AU_AvisosUsuarios(
    idUsuario INT PRIMARY KEY,
    idAviso INT PRIMARY KEY,
   	FOREIGN KEY(idUsuario) REFERENCES UCM_AW_CAU_USU_Usuarios(idUsuario)
    FOREIGN KEY(idAviso) REFERENCES UCM_AW_CAU_AV_Avisos(idAviso)
);

CREATE TABLE UCM_AW_CAU_AU_AvisosTenicos(
    idAviso INT PRIMARY KEY,
    numTecnico INT PRIMARY KEY,
   	FOREIGN KEY(idUsuario) REFERENCES UCM_AW_CAU_USU_Usuarios(idUsuario)
    FOREIGN KEY(numTecnico) REFERENCES UCM_AW_CAU_UT_UsuarioTecnico(numTecnico)
);