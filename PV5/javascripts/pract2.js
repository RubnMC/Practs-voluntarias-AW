"use strict";

let listaT = [
    { text: "Preparar prácticas AW", tags: ["universidad", "practica"] }
    , { text: "Mirar fechas congreso", done: true, tags: [] }
    , { text: "Ir al supermercado", tags: ["personal", "básico"] }
    , { text: "Jugar al fútbol", done: false, tags: ["personal", "deportes"] }
    , { text: "Hablar con profesor", done: false, tags: ["universidad", "tp2"] }
];

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

function createTask(tareaTexto) {

    let arrayPalabras = tareaTexto.split(" ");

    let labels = arrayPalabras.filter(r => r.startsWith("@")).map(r => r.replace("@",''));
    
    let tareTexto = arrayPalabras.filter(r => !r.startsWith("@"));

    return { text: tareTexto.join(' '), tags: labels }
}

console.log(getToDoTasks(listaT).map(o => o.text));
console.log("-------------------------------------------");
console.log(findByTag(listaT, "personal").map((o) => ({text:o.text, tags:o.tags})));
console.log("-------------------------------------------");
console.log(findByTags(listaT, ["universidad", "deportes"]).map((o) => ({text:o.text, tags:o.tags})))
console.log("-------------------------------------------");
console.log(countDone(listaT));
console.log("-------------------------------------------");
console.log(createTask("Ir al medico @personal @salud"))
console.log(createTask("Ir a @deporte entrenar"))
console.log(createTask("@universidad @practica Preparar prácticas TP"))
