'use strict'

//Requires
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar express
var app = express();

// Cargar archivos de rutas


// Añadir middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configurar CORS

// Configurar Rutas or Re-write
//Ruta de prueba
app.get('/prueba', (req, res) => {
	return res.status(200).send("<h1>Hola mundo soy el back-end</h1>");
	/*
	return res.status(200).send({
		message : 'Hola mundo desde el back-end NodeJS by Pacu'
	});
	*/
});

//Exporting modulos
module.exports = app;
