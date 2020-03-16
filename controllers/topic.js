'use strict'

var validator =  require('validator');
var Topic = require('../models/topic');

var controller = {

	test: function(req,res){
		return res.status(200).send({
			message: 'Hola que tal!'
		});
	},

	save: function(req,res){

		//Recoger parametros por post
		var params = req.body;

		//validar datos
		try{
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);;
			var validate_lang = !validator.isEmpty(params.lang);

		}catch(err){
		
		return res.status(200).send({
			    message: 'Faltan datos por enviar',
			    err
		    });

		}
		if(validate_content && validate_lang && validate_title){

			//Crear objeto a guardar
			var topic = new Topic();
			
			//Asignar valores
			topic.title = params.title;
			topic.content = params.content;
			topic.code = params.code;
			topic.lang = params.lang;
			topic.user = req.user.sub

			//Guardar el topic
			topic.save((err,topicStored) => {
				if(err || !topicStored){
				
					return res.status(404).send({
						status: 'error',
						message: 'el tema no se ha guardado'
				    });
				}

				//Devolver una respuesta
				return res.status(200).send({
					status: 'success',
				    topic: topicStored
		    	});

			});

		}else{
			return res.status(500).send({
				message: 'Los datos no son validos'
			});
		}
    },

    getTopics: function(req,res){
    	//Cargar la libreria de paginacion en la clase
    	var page = req.params.page;

    	//Recojer la pagina actual
    	if(!req.params.page || req.params.page == null || req.params.page == undefined || req.params.page == "0"){
    		var page = 1;
    	}else{
    		var page = parseInt(req.params.page);
    	}


    	//Indicar las opciones de paginacion
    	//Populate hace un join
    	var options = {
    		sort: { date: -1 },
    		populate: 'user',
    		limit: 5,
    		page: page
    	}

    	//Find paginado
    	Topic.paginate({}, options, (err, topics) => {
    	
    	if(err){
    		return res.status(500).send({
    			status: 'error',
				message: 'Error al hacer la consulta'
			});
    	}
    	if(!topics){
    		return res.status(404).send({
    			status: 'error',
				message: 'No hay topics'
			});

    	}

    	//Devolver resultado (topics, total de topics, total de paginas)
    	return res.status(200).send({
    		    status: 'success',
				topics: topics.docs,
				totalDocs: topics.totalDocs,
				totalPages: topics.totalPages
			});
    	});
    },
    getMyTopicsByUser: function(req,res){
    	//Conseguir el id del usuario
    	var userId = req.params.user;
    	//Find con la condicion de usuario
    	Topic.find({
    		user: userId
    	})
    	.sort([['date','descending']])
    	.exec((err,topics) => {
    		if(err){
    			return res.status(500).send({
    				status: 'error',
		    		message: 'Error en la peticion'
				});
    		}
    		if(!topics){
    			return res.status(500).send({
    				status: 'error',
		    		message: 'No hay temas para mostrar'
				});
    		}

	    	//Delver un resultado
	    	return res.status(200).send({
	    		status: 'success',
	    		topics
			});
    	});
    },

    getTopic: function(req,res){
    	//Obtener el topic de la URL
    	var topicId = req.params.id;

    	//Hacer un Find por Id del topic
    	Topic.findById(topicId)
    	     .populate('user')
    	     .populate('comments.user')
    	     .exec((err,topic) => {
    	     	if(err){
    	     		return res.status(500).send({
    					status: 'error',
    					message: 'Error en la peticion'
					});
    	     	}
    	     	if(!topic){
    	     		return res.status(404).send({
    					status: 'error',
    					message: 'No existe el topic'
					});
    	     	}
    	     	//Devolver el resultado
                return res.status(200).send({
    				status: 'success',
    				topic
				});

    	     });
    },

    update: function(req,res){
    	//Recojer el ID del topic de la URL
    	var topicId = req.params.id;
    	//recojer los datos que llegan desde post
    	var params = req.body;
    	//validar datos
    	try{
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);;
			var validate_lang = !validator.isEmpty(params.lang);

		}catch(err){
		
		return res.status(200).send({
			    message: 'Faltan datos por enviar',
			    err
		    });

		}
		if(validate_title && validate_content && validate_lang){
	    	//montar un JSON con los datos modificables
	    	var update = {
	    		title: params.title,
	    		content: params.content,
	    		code: params.code,
	    		lang: params.lang
	    	};

	    	//Find and Update del topic por id y por id de usuario
	    	Topic.findOneAndUpdate({_id:topicId, user: req.user.sub}, update, {new:true}, (err,topicUpdated) => {
	    		if(err){
	    			return res.status(500).send({
	    				status:'success',
					    message: 'Error en la peticion'
				    });
	    		}
	    		if(!topicUpdated){
	    			return res.status(404).send({
	    				status:'success',
					    message: 'No se ha actualizado el tema'
				    });
	    		}
	    		return res.status(200).send({
		    		status:'success',
				    topicUpdated
		    	});

	    	});

	    }else{
	    	return res.status(500).send({
	    		message: 'La validacion de los datos no es correcta'
	    	});
    	}
    },

    delete: function(req,res){
    	//Obtener el id del topic de la url
    	var topicId = req.params.id;
    	//find and delete por topic id y por userId
    	Topic.findOneAndDelete({_id:topicId,user:req.user.sub},(err,topicDeleted) => {
    		if(err){
    			return res.status(500).send({
		    		status: 'error',
		    		message: 'Error en la peticion'
	    		});
    		}
    		if(!topicDeleted){
    			return res.status(500).send({
		    		status: 'error',
		    		message: 'No se ha borrado el tema'
	    		});
    		}
    	    //Devolver una respuesta
    		return res.status(200).send({
	    		message: 'success',
	    		topic: topicDeleted
	    	});
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
		.populate('user')
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