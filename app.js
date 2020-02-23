'use strict'

//Requires
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar express
var app = express();

// Cargar archivos de rutas
var user_routes = require('./routes/user');
var topic_routes = require('./routes/topic');
var coment_routes = require('./routes/coments');

// Añadir middlewares
//Convierte el body a un objeto de javascript
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Configurar Rutas or Re-write

app.use('/api',user_routes);
app.use('/api',topic_routes);
app.use('/api',coment_routes);


//Exporting modulos
module.exports = app;
