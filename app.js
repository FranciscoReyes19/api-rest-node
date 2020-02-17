'use strict'

//Requires
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar express
var app = express();

// Cargar archivos de rutas
var user_routes = require('./routes/user');
var topic_routes = require('./routes/topic');

// Añadir middlewares
//Convierte el body a un objeto de javascript
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configurar CORS

// Configurar Rutas or Re-write

app.use('/api',user_routes);
app.use('/api',topic_routes);


//Exporting modulos
module.exports = app;
