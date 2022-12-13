// app.js 

const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config");
const router = require("./routes/router");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");

// Crear un servidor Express.js 
const app = express();

//Sesiones
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(config.mysqlConfig);
const middelwareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(middelwareSession);
app.use('/',router);

// Arrancar el servidor 
app.listen(config.portS, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    } else {
        console.log('Servidor arrancado en el puerto ${config.port}');
    }
});