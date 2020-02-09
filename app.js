'use strict'

//Requires
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar express
var app = express();

// Cargar archivos de rutas
var user_routes = require('./routes/user');

// Añadir middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configurar CORS

// Configurar Rutas or Re-write

app.use('/api',user_routes);


//Exporting modulos
module.exports = app;
