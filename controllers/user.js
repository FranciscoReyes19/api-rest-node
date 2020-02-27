'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
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
	deleteUser: function(req,res){

		var idUser = req.params.userId;
		User.findOneAndDelete({ _id: idUser }, (err, user) => {

			if(err){
				return res.status(500).send({
					message: "Error al intentar borrar al usuario",
				});

			}
			if(!user){
				return res.status(404).send({
					message: "El usuario no existe",
				});
			}
			if(user){
					return res.status(200).send({
						message: "Eliminacion de usuario exitosa"
					});
		    	} 
			}

	    );
	},

	save: function(req,res){
		//Recojer los parametros de la peticion
		var params = req.body;
		//Validar los datos
		try{
		var validate_name = !validator.isEmpty(params.name);
		var validate_surname = !validator.isEmpty(params.surname);
		var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
		var validate_password = !validator.isEmpty(params.password);
		}catch{
			return res.status(500).send({
				message: "Faltan datos por enviar",
				params
			});
		}

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
		try{
		var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
		var validate_password = !validator.isEmpty(params.password);
	    }catch(err){
	    	return res.status(500).send({
				message: "Faltan datos por enviar"
			});
	    }

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
							return res.status(201).send({
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
		//Recojer datos del usuario
		var params = req.body;
		
		//Validar datos
		try{
		var validate_name = !validator.isEmpty(params.name);
		var validate_surname = !validator.isEmpty(params.surname);
		var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
	    }catch(err){
	    	return res.status(500).send({
				message: "Faltan datos por enviar"
			});
	    }
		//var validate_password = !validator.isEmpty(params.password);

		//Eliminar propiedades innecesarias
		var userId = req.user.sub;
		//console.log(userId);
		delete params.password;
		//console.log(req.user.email);
		//console.log(params.email);
		//Comprobar si el email es unico
				
		if(req.user.email != params.email){
			User.findOne({ email: params.email.toLowerCase()}, (err, user) => {
				if(err){
					return res.status(500).send({
						message: "Error al intentar identificarse"
					});
				}
				if(user && user.email == params.email ){
					return res.status(200).send({
						message: "El email ya existe en la base de datos"
					});
				}
				// Buscar y actualizar documento de la base de datos
					User.findOneAndUpdate({_id: userId},params, {new:true}, (err,userUpdated) => {
						if(err){
							return res.status(500).send({
							    status: 'error',
						        message: 'Error al actualizar usuario'
						    });
						}
                        if(!userUpdated){
							return res.status(500).send({
								status: 'error',
							    message: 'Error al actualizar usuario userUpdated'
							});
						}
						return res.status(200).send({
							status: "success",
						    user: userUpdated
						});
					});
			});
		}else{
			 return res.status(500).send({
			    status: 'error',
				message: 'Error al actualizar usuario userUpdated'
				});
        }
	},
	uploadAvatar: function(req,res){
		//Configurar el modulo multiparty routes/users.js

		//Recoger el fichero de la peticion
		var file_name = 'Avatar no subido...';

		if(!req.files){
			return res.status(404).send({
			    status: "error",
			    message: file_name
		    });
		}

		//Conseguir el nombre y la extension del archivo subido
		var file_path = req.files.file0.path;
		var file_split = file_path.split('\\');

		var file_name = file_split[2];
		var file_extension = file_name.split('.');
		var file_ext = file_extension[1];

		//Comprobar extension (solo imagenes), si no es valida borrar archivo subido
		if(file_ext != "png" && file_ext != "jpg" && file_ext != "jpeg" && file_ext != "gif" ){
			
		fs.unlink(file_path, (err) => {
			return res.status(404).send({
			    status: "error",
			    message: "La extension del archivo no es valida"
		    });
		});
	}else{

		//Sacar el id del usuario identificado
		var userId = req.user.sub;

		//Buscar y actualizar documento de la DB
		User.findOneAndUpdate(userId, {image: file_name},{new:true}, (err,userUpdated) => {
			//Devolver una respuesta
			if(err || !userUpdated){
				return res.status(500).send({
				    status : "error",
				    message: "Error al guardar el usuario"
			    });
			}

			return res.status(200).send({
				status: 'success',
				message: 'Upload AVATAR',
				user: userUpdated
			});

		});	
	}
	},
	avatar: function(req,res){
		var fileName = req.params.fileName;
		var pathFile = './uploads/users/'+fileName;

		fs.exists(pathFile, (exists) => {
			if(exists){
				return res.sendFile(path.resolve(pathFile));
			}else{
				return res.status(404).send({
					message: 'La imagen no existe'

				});
			}

		});
	},

	getUsers: function(req, res){
		User.find().exec((err,users) => {
			if(err || !users){
				return res.status(404).send({
					status: 'error',
					message: 'no hay usuarios que mostrar'
				})
			}

			return res.status(200).send({
				status: 'success',
				users
			});
		});
	},
	getUser: function(req,res){
		var userId = req.params.userId;
		User.findById(userId).exec((err,user) => {
			if(err || !user){
				return res.status(404).send({
					status: 'error',
					message: 'no existe el usuario'
				})
			}

			return res.status(200).send({
				status: 'success',
				user
			});
		});
	}
};

module.exports = controller;