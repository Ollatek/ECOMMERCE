const express = require('express');

const authController = require('./../controllers/authController');
const productController = require('./../controllers/productController');
const imageController = require('./../controllers/imageController');
const router = express.Router();

router.route('/')
    .get(authController.isLoggedIn, productController.getProducts)
    .delete(productController.deleteProducts)
    .post(productController.createProduct);

router.route('/:productId')
    .patch(
        imageController.productImages,
        imageController.resizeProductPhoto,
        productController.updateProduct)
    .delete(productController.deleteProduct)
    .get(productController.getProduct);


module.exports = router;
