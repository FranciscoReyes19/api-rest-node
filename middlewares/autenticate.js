'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'clave-secreta-token95';

exports.authenticated = function(req, res, next){
	//comprobar si nos llega la cabecera de autorizacion, se debe llamar authorization literalmente en el header

	if(!req.headers.authorization){
		return res.status(403).send({
			message: 'La peticion no tiene la cabecera de autorizacion'
		});
	}

	//Limpiar el token y quitar comillas
	var token = req.headers.authorization.replace(/['*]+/g, '');
	
	try{
		//Decodificar el token
		var payload = jwt.decode(token, secret);

	    //Comprobar si el token ha expirado
		if(payload.exp <= moment().unix()){
			return res.status(403).send({
				message: 'El token ha expirado'
			});
		}

	}catch(ex){
		return res.status(404).send({
			message: 'El token no es valido'
		});

	}

	

	//Adjuntar usuario identificado a la request
	req.user = payload;

    // pasar a la accion
	next();
};