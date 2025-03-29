const express = require('express');

const reviewController = require('./../controllers/reviewController');

const authController = require('./../controllers/authController');

const router = express.Router();


router.route('/')
    .post(authController.protect, reviewController.createReview)
    .get(reviewController.getProductReviews);

router.route('/:reviewId')
    .patch(authController.protect, reviewController.updateReview)
    .delete(authController.protect, reviewController.deleteReview)
    .get(reviewController.getReview);

module.exports = router;
