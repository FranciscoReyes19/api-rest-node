'use strict'

var express = require('express');
var ComentController = require('../controllers/coments');

var router = express.Router();
var md_auth = require('../middlewares/autenticate');

//? significa opcional
router.post('/coment/topic/:topicId', md_auth.authenticated, ComentController.add);
router.put('/coment/:comentId', md_auth.authenticated, ComentController.update);
router.delete('/coment/:topicId/:commentId', md_auth.authenticated, ComentController.delete);
router.get('/search/:search', ComentController.search);

module.exports  = router;