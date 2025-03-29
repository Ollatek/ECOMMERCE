const express = require('express');
const categoryController = require('./../controllers/categoryController');

const router = express.Router();

router.route('/')
    .get(categoryController.getCategories)
    .post(categoryController.createCategory)
    .delete(categoryController.deleteCategories);

router.route('/:categoryId')
    .delete(categoryController.deleteCategory)
    .patch(categoryController.updateCategory)
    .get(categoryController.getCategory);

module.exports = router;
