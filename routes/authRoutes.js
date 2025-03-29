const express = require('express');
const authController = require('./../controllers/authController');
const User = require('../models/userModel');

const router = express.Router();

router.post('/sign_up', authController.signUp);
router.post('/login', authController.login);
router.post('/forgot_password', authController.forgotPassword);
router.patch('/reset_password/:token', authController.resetPassword);

module.exports = router;
