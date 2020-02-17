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

UserSchema.methods.toJSON = function(){
	var obj = this.toObject();
	delete obj.password;

	return obj;	
};
//exportar el modulo

module.exports = mongoose.model('User', UserSchema);
//lowercase y pluralizar el nombre a users y dentro habra documentos con el schema
