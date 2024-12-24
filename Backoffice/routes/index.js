const express = require('express');
const router = express.Router();
const cors = require('cors');
const authController = require('../controllers/authController');
var userController = require('../controllers/userController');

//get
router.get("/register", authController.registerForm);
router.get("/login", authController.loginForm);
router.get("/dashboard", authController.verifyToken, authController.verifyTokenAdmin,  authController.dashboard);
router.get("/logout", authController.logout);
router.get('/profile', authController.verifyToken, authController.verifyTokenAdmin,  authController.profile);
router.get('/edit/:id', authController.verifyToken, authController.verifyTokenAdmin, authController.formEdit);
router.get('/delete/:id', authController.verifyToken, authController.verifyTokenAdmin,  authController.delete);
router.get('/delete/:id', authController.verifyToken, authController.verifyTokenAdmin,  authController.delete);

//post
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post('/edit/:id', authController.verifyToken, authController.edit);

module.exports = router;
