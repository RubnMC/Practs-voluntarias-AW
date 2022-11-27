"use strict";

const DAOUsuario = require("../DAO/DAOUsuario");

class SAUsuario {
    constructor(pool) {
        this.daoUser = new DAOUsuario(pool);
        this.today = new Date();
    }

    parseUser(user) {
        let tec = false;
        if (user.esTecnico === 'ON') {
            tec = true;
        }
        return {
            correo: user.email,
            rol: tec,
            numTecnico: user.numEmpleado,
            nombre: user.nombre,
            perfilUniversitario: user.profile_type,
            password: user.password,
            imagen: user.profile_Image,
        };
    }

    crearUsuario(user) {
        if (user.password !== user.password_2) {
            throw new Error("Error: Las contraseñas no coinciden");
        }
        if (user.numEmpleado && !(/\d{4}\-[A-Z]{3}/.test(user.numEmpleado))) {
            throw new Error("Formato de num.empleado incorrecto (0000-ABC)");
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(user.password)) {
            throw new Error("La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, una minúscula, una mayuscula y un caracter especial")
        }
        this.daoUser.createUser(this.parseUser(user), function (err, res) {
            if (err) {
                throw err;
            }
            else {
                console.log(res);
            }
        });
    }

}

module.exports = SAUsuario;
