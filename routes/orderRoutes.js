const express = require('express');

const orderController = require('./../controllers/orderController');
const authController = require('./../controllers/authController');

const router = express.Router();


router.use(authController.protect);
router.route('/').post(orderController.createOrder);

module.exports = router;
