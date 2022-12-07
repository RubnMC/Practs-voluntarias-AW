function getToDoTasks(tareas) {
    return tareas.filter(t => !t["done"]);
}

function findByTag(tareas, tag) {
    return tareas.filter(task => task.tags.includes(tag))
}

function findByTags(tareas, listaTags) {
    return tareas.filter(function (task) {
        return task.tags.some(function (label) {
            return listaTags.indexOf(label) >= 0;
        });
    });
}

function countDone(listaTareas) {
    return listaTareas.reduce((acum, t) => acum + (t.done ? 1 : 0), 0);
}

function parseTask(tareaTexto) {

    let arrayPalabras = tareaTexto.split(" ");

    let labels = arrayPalabras.filter(r => r.startsWith("@")).map(r => r.replace("@", ''));

    let tareTexto = arrayPalabras.filter(r => !r.startsWith("@"));

    return { texto: tareTexto.join(' '), tags: labels }
}

function auth(request, response, next) {
    if (request.session.currentUser) {
        response.locals.userEmail = request.session.currentUser;
        next();
    }
    else {
        response.redirect("login");
    }
}

module.exports = { getToDoTasks, findByTag, findByTags, countDone, parseTask, auth };