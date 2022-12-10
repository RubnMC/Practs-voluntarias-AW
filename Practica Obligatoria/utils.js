const fs = require("fs");
const moment = require("moment");

function auth(request, response, next) {
    if (request.session.currentUser) {
        response.locals.currentUser = request.session.currentUser;
        next();
    }
    else {
        response.redirect("login");
    }
}

function getTiposAvisos(request, response, next) {

    switch (response.locals.currentUser.perfilUniversitario) {
        case "A":
            fs.readFile("./public/resources/avisosA.json", function (error, content) {
                if (!error) {
                    response.locals.tiposAvisos = JSON.parse(content);
                    next();
                }
                else {
                    console.log(error);
                }
            })
            break;
        case "AA":
            fs.readFile("./public/resources/avisosAA.json", function (error, content) {
                if (!error) {
                    response.locals.tiposAvisos = JSON.parse(content);
                    next();
                }
                else {
                    console.log(error);
                }
            })
            break;
        case "PAS":
            fs.readFile("./public/resources/avisosPAS.json", function (error, content) {
                if (!error) {
                    response.locals.tiposAvisos = JSON.parse(content);
                    next();
                }
                else {
                    console.log(error);
                }
            })
            break;
        case "PDI":
            fs.readFile("./public/resources/avisosPDI.json", function (error, content) {
                if (!error) {
                    response.locals.tiposAvisos = JSON.parse(content);
                    next();
                }
                else {
                    console.log(error);
                }
            })
            break;
        default:
            break;
    }

}

function parseAvisoTipo(tipo) {
    switch (tipo) {
        case 'I':
            return "Incidencia";
        case 'F':
            return "Felicitación";
        case 'S':
            return "Sugerencia";
        default:
            break;
    }
}

function stampToDate(timestamp) {
    return moment(timestamp).format('DD/MM/YYYY')
}

function parseUserType(userType) {
    switch (userType) {
        case 'A':
            return 'Alumno';
        case 'AA':
            return 'Antiguo Alumno';
        case 'PAS':
            return 'Personal de administración y servicios'
        case 'PDI':
            return 'Personal docente investigador'
        default:
            return 'Unknown'
    }
}

function countAvisos(avisos) {
    let res = { total: 0, sugerencias: 0, incidencias: 0, felicitaciones: 0 };
    avisos.forEach(a => {
        switch (a.tipo) {
            case 'F':
                res.felicitaciones++;
                break;
            case 'S':
                res.sugerencias++;
            case 'I':
                res.incidencias++;
        }
        res.total++;
    });
   return res;
}

module.exports = { auth, getTiposAvisos, parseAvisoTipo, stampToDate, parseUserType,countAvisos }