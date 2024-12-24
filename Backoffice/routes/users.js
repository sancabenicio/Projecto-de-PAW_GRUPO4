var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var ticketController = require('../controllers/ticketController');
var authController = require('../controllers/authController');


//get
router.get('/', authController.verifyToken, authController.verifyTokenAdmin, userController.showAll);
router.get('/show/:id', authController.verifyToken, authController.verifyTokenAdmin, userController.show);
router.get('/create', authController.verifyToken, authController.verifyTokenAdmin, userController.formCreate);
router.get('/edit/:id', authController.verifyToken, authController.verifyTokenAdmin, userController.formEdit);
router.get('/delete/:id', authController.verifyToken, authController.verifyTokenAdmin, userController.delete);
router.get('/tickets/:id', authController.verifyToken, authController.verifyTokenAdmin, ticketController.show);
router.get('/ticketsAPI/:id', ticketController.showJSON);
router.get('/profile', userController.verifyTokenClient, userController.getAuthenticatedUser, userController.profile);
router.put('/change-password', userController.getAuthenticatedUser, userController.changePassword);
router.put('/edit-profile', userController.getAuthenticatedUser, userController.editProfile);
router.delete('/delete-profile', userController.getAuthenticatedUser, userController.deleteProfile);

//post
router.post('/loginCliente', userController.loginCliente);
router.post('/registerCliente', userController.registerCliente);
router.post('/create', authController.verifyToken, authController.verifyTokenAdmin, userController.create);
router.post('/edit/:id', authController.verifyToken, authController.verifyTokenAdmin, userController.edit);
router.post('/recuperarSenha', userController.recuperarSenha);

module.exports = router;