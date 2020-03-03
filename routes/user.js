'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var md_auth = require('../middlewares/autenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });

router.get('/probando', UserController.probando);
router.post('/testeando', UserController.testeando);

//prueba de usuario
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/update-user', md_auth.authenticated, UserController.update);
router.post('/upload-avatar', [md_auth.authenticated,md_upload], UserController.uploadAvatar);
router.get('/avatar/:fileName', UserController.avatar);
router.get('/users', UserController.getUsers);
router.get('/user/:userId', UserController.getUser);
router.delete('/user/:userId', UserController.deleteUser);

module.exports = router;