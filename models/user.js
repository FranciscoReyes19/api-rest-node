'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	image: String,
	role: String
});

//exportar el modulo

module.exports = mongoose.model('User', UserSchema);
//lowercase y pluralizar el nombre a users y dentro habra documentos con el schema
