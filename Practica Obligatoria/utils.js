const fs = require("fs");

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

module.exports = {auth, getTiposAvisos}