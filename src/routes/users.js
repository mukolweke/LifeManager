const express = require('express');
const router = express.Router();
const User = require('../models/User');
const userController = require('../controllers/usersController');

const controller = userController(User);


router.get('/login', controller.getLogin);

router.get('/register', controller.getRegister);

router.get('/forgot-pass', controller.getForgotPass);

router.get('/forgot-pass-reset', controller.getForgotPassReset);

router.post('/register', controller.saveUser);

router.post('/login', controller.loginUser);

router.post('/forgot-pass-reset', controller.updatePassword);

router.post('/forgot-pass', controller.confirmForgotPass);

router.get('/logout', controller.logoutUser);


module.exports = router;