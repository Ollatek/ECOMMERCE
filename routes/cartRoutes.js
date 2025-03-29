const express = require('express');

const cartController = require('./../controllers/cartController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.delete('/all', cartController.deleteCarts);

router.route('/')
.patch(cartController.updateCart)
.get(cartController.getCart)
.delete(cartController.deleteCart);

module.exports = router;
