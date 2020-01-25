'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3999;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/api_rest_node', {useNewUrlParser: true})
	.then(() => {
		console.log('La conexion a la DB mongo se ha realizado OK_cambio en Git');
		//crear el servidor
		app.listen(port, () => {
			console.log('el servidor esta run OK en por 39999 woooooowwwiii');

		});
	
	}).catch(error => console.log(error));