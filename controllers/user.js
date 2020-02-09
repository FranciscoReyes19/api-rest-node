'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');


var controller = {
	probando: function(req, res){
		return res.status(200).send({
			message: "Soy un metodo prueba"
		});

	},
	testeando: function(req, res){
		return res.status(200).send({
			message: "Soy un metodo testeando"
		});
	},

	save: function(req,res){
		//Recojer los parametros de la peticion
		var params = req.body;
		//Validar los datos
		var validate_name = !validator.isEmpty(params.name);
		var validate_surname = !validator.isEmpty(params.surname);
		var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
		var validate_password = !validator.isEmpty(params.password);

		//console.log(validate_name, validate_surname, validate_email, validate_password);
		if(validate_name && validate_surname && validate_email && validate_password){
		
		    //Crear el objeto de usuario
		
			var user = new User();

	        //asignar valores al usuario
	        user.name = params.name;
	        user.surname = params.surname;
	        user.email = params.email.toLowerCase();
	        user.role = 'ROLE_USER';
	        user.image = null;

			//comprobar si existe
			User.findOne({email: user.email},( err, issetUser ) => {
					if(err){
						return res.status(500).send({
					        message: "Error en la validacion, existe duplicidad"
	                    });
					}
					if(!issetUser){
					   //cifrar
					   bcrypt.hash(params.password,null,null, (err,hash) => {
					        user.password = hash;

					        //guardar
							   user.save((err, userStored) => {
								   if(err){
									   return res.status(500).send({
				    				   message: "Error al guardar el usuario"
				    				   });
								   }
								   if(!userStored){
								       return res.status(500).send({
				    				   message: "El usuaario no se ha guardado"
				    				   });	
								   }
							   
							   //Devolver respuesta de exito
							   return res.status(200).send({
				    		       message : "El usuaario se ha guardado correctamente",
				    		       user:userStored
				    		   }); 

				    		});    //close save
                       
					   }); //close bcrypt

					}else{

						return res.status(200).send({
    						message: "El usuario ya esta registrado"
					    });
					}
				}
			);

		}else{
			return res.status(500).send({
				message: "Error en la validacion"
			});
		}
	},

	login: function(req,res){

		//recojer los parametros de la peticion
		var params = req.body;

		//validar los datos
		var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
		var validate_password = !validator.isEmpty(params.password);

		if(!validate_email || !validate_password){
			return res.status(500).send({
				message: "Los datos son incorrectos"
			});
		}

		//buscar usuarios que coicidan con el email recibido

		User.findOne({ email: params.email.toLowerCase()}, (err, user) => {

			if(err){
				return res.status(500).send({
					message: "Error al intentar identificarse",
				});

			}
			if(!user){
				return res.status(404).send({
					message: "El usuario no existe",
				});
			}

				//Si lo encuentra
				//comprobar contraseña (coincidencia y password)
				bcrypt.compare(params.password, user.password, (err,check) => {
					//si es correcto
					if(check){
                     	//Generar un TOKEN de JWT
                     	if(params.gettoken){
                     		return res.status(200).send({
								token: jwt.createToken(user)
							});

                     	}else{

							//Limpiar el objeto
							user.password = undefined;
							//Devolver datos OK
							return res.status(200).send({
								message: "Exito",
								user
							});
						}
				    }else{
				    	return res.status(500).send({
							message: "Credenciales incorrectas"
						});
				    }
				});
				
		    } 

	    );
		
	},

	update: function(req,res){
		//Crear middleware para comprobar jwt token y adjuntar
		//

		return res.status(200).send({
			message: "Metodo de actualizacion"
	    });
	}

};

module.exports = controller;