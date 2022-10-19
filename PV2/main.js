"use strict";

let listaT = [
    {text:"Preparar prácticas AW", tags:["universidad","awt"]}
    ,{text: "Mirar fechas congreso", done: true, tags:[]}
    ,{text: "Ir al supermercado", tags: ["personal", "básico"]}
    ,{text: "Jugar al fútbol", done: false, tags:["personal", "deportes"]}
    ,{text: "Hablar con profesor", done: false, tags:["universidad", "tp2"]}
    ];

function notFinished(task){
    return !task["done"];
}

function sameTag(task, tag){
    return task["tags"].includes(tag);
}

function getToDoTasks(tareas){
    return tareas.filter(notFinished);
}

function findByTag(tareas, tag){
    return tareas.filter(sameTag);
}

console.log(getToDoTasks(listaT).map(o => o.text));
console.log(findByTag(listaT,"personal"));