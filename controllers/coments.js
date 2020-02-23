'use strict'

var Topic = require('../models/topic');
var validator = require('validator');

var controller = {
	add: function(req,res){
		//Recoger el id del topic de la URL
		var topicId = req.params.topicId;
		//Find por id del topic
		Topic.findById(topicId).exec((err,topic) => {
			if(err){
				return res.status(500).send({
					status: 'error',
					message:'Error en la peticion de añadir'
				});
			}
			if(!topic){
				return res.status(404).send({
					status: 'error',
					message:'No existe el tema'
				});
			}

			//Comprobar objeto usuario y validar datos
			if(req.body.content){
				try{
					var validate_content = !validator.isEmpty(req.body.content);

				}catch(err){

				return res.status(500).send({
					    message: 'No has comentado nada!',
					    err
				    });
				}

				if(validate_content){
					var coment = {
						user:req.user.sub,
						content: req.body.content,

					};
					//En la propiedad coments del objeto resultante, hacer un push
					topic.comments.push(coment);
					//Guardar el topic completo
					topic.save((err) => {
						if(err){
							return res.status(500).send({
							status: 'error',
							message:'Erro en la peticion'
						});

						}

						return res.status(200).send({
							status: 'success',
							topic
						});
						//Devolver una respuesta
						return res.status(200).send({
							message:'metodo de añadir comentario'
						});
					});

				}else{
					return res.status(200).send({
						message:'No se han validado los datos del comentario'
					});
				}
			}

		});
	},
	update: function(req,res){
		//Conseguir el id del comentario que llega por la URL
		var comentId = req.params.comentId;
		//Recoger datos y validar
		var params = req.body;

		try{
			var validate_content = !validator.isEmpty(params.content);
		}catch(err){

				return res.status(500).send({
						status:'error',
					    message: 'Error en la validacion'
				    });
		}
		if(validate_content){
			//Find and Update de subdocumento de un comentario
			Topic.findOneAndUpdate(
				{"comments._id":comentId},
				{ "$set": {"comments.$.content":params.content}},
				{new:true},
				(err,topicUpdate) => {
					if(err){
						return res.status(500).send({
							status: 'error',
							message:'Error en la peticion de actualizar'
						});
					}
					if(!topicUpdate){
						return res.status(404).send({
							status: 'error',
							message:'No se realizo la actualizacion'
						});
					}

					//Devolver llamada
					return res.status(200).send({
						status:'success',
						message:'comentario actualizado correctamente',
						topic: topicUpdate
					});
				});
		}
	},
	delete: function(req,res){
		//sacar el id del topic y del comentario a borrar
		var topicId = req.params.topicId;
		var commentId = req.params.commentId;

		//Buscar el topic
		Topic.findById(topicId,(err,topic) => {
			if(err){
				return res.status(500).send({
					status: 'error',
					message:'Error en la peticion de borrar'
				});
			}
			if(!topic){
				return res.status(404).send({
					status: 'error',
					message:'No se realizo la eliminacion'
				});
			}

			//Seleccionar el sub-documento (comentario)
			var comment = topic.comments.id(commentId);

			//Borrar el comentario si fue encontrado
			if(comment){
				comment.remove();
					//Guardar el topic
					topic.save((err) => {
						if(err){
							return res.status(500).send({
								status: 'error',
								message:'Error en la peticion de borrar'
							});
						}
						//Devolver el resultado
						return res.status(200).send({
							status: 'success',
							topic
						});
					});
			}else{
				return res.status(404).send({
					status: 'error',
					message:'No existe el comentario'
				});
			}
		});
	},
	search: function(req,res){
		//Sacar el string a buscar de la URL
		var searchString = req.params.search;
		//find con un operador OR
		Topic.find({ "$or": [
			{ "title": { "$regex": searchString, "$options": "i"} }, 
			{ "content": { "$regex": searchString, "$options": "i"} },
			{ "lang": { "$regex": searchString, "$options": "i"} },
			{ "code": { "$regex": searchString, "$options": "i"} }
		]})
		.sort([['date','descending']])
		.exec( (err,topics) => {
			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'error en la peticion'
				});
			}
			if(!topics){
				return res.status(404).send({
					status: 'error',
					message: 'No hay temas disponibles'
				});
			}
			//Devolver el resultado
			return res.status(200).send({
					status: 'success',
					topics
			});
		});
	}

};

module.exports = controller;