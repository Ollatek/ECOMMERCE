const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();



router.use(authController.protect);

router.route('/')
    .get(userController.getUsers)
    .delete(userController.deleteUsers)
    .post(userController.createUser);

router.route('/:userId')
    .get(userController.getUser)
    .delete(userController.deleteUser)

module.exports = router;
