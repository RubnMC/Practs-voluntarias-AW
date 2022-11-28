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
    fecha TIMESTAMP NOT NULL,
    solucionado BOOLEAN NOT NULL
);

CREATE TABLE UCM_AW_CAU_AU_AvisosUsuarios(
    idUsuario INT,
    idAviso INT,
   	FOREIGN KEY(idUsuario) REFERENCES UCM_AW_CAU_USU_Usuarios(idUsuario),
    FOREIGN KEY(idAviso) REFERENCES UCM_AW_CAU_AV_Avisos(idAviso),
    CONSTRAINT PK_UCM_AW_CAU_AU_AvisosUsuarios PRIMARY KEY (idUsuario,idAviso)
);

CREATE TABLE ucm_aw_cau_su_sugerencias(
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(4) NOT NULL,
    texto VARCHAR(50) NOT NULL
);

INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('AD','Certificado digital de persona física');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('AD','Certificado eléctronico de empleado público');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('AD','Registro electrónico');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('AD','Sede electrónica');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('AD','Portafirmas');

INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('COM','Correo electrónico');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('COM','Google Meet');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('COM','Cuenta de Alumno');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('COM','Cuenta de personal');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('COM','Cuenta genérica');

INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('CONE','Cuenta a la Red SARA');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('CONE','Conexión por cable en despachos');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('CONE','Cortafuegos corporativo');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('CONE','Resolución de nombres de dominio(DNS)');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('CONE','VPN Acceso remoto');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('CONE','Wifi Eduroam (ssid: eduroam)');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('CONE','Wifi para visitantes(ssid: UCM-Visitantes)');

INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('DOC','Aula Virtual');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('DOC','Blackboard Collaborate');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('DOC','Listados de clase');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('DOC','Moodle: Aula GLobal');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('DOC','Plataforma de cursos online Privados');

INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('WEB','Analítica Web');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('WEB','Emisión de certificados SSL');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('WEB','Hosting: alojamiento de páginas web');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('WEB','Portal de eventos');
INSERT INTO ucm_aw_cau_su_sugerencias (tipo,texto) VALUES ('WEB','Redirecciones web');