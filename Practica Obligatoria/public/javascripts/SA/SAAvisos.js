"use strict";

const DAOAvisos = require('../DAO/DAOAvisos');

class SAUsuario {
    constructor(pool) {
        this.daoAvisos = new DAOAvisos(pool);
        this.today = new Date();
    }

    getAvisos(user, callback){
        this.daoAvisos.getAvisos(user, function(err, res){
            if (err) {
                callback(err);
            }
            else {
                callback(null, res);
            }
        })
    }


}