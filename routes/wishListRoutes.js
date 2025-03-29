const express = require('express');

const wishListController = require('./../controllers/wishListController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/')
    .get(wishListController.getWishList)
    .patch(wishListController.updateWishList);

module.exports = router;
